import axios from "axios";
import csvtojson from "csvtojson";
import { Readable } from "stream";
import { Message } from "../../entities/message";
import { IntentRepository } from "../../repositories/intent_repository";
import { MessageRepository } from "../../repositories/message_repository";
import { Conversation } from "../../entities/conversation";
import { ConversationRepository } from "../../repositories/conversation_repository";
import { Intent } from "../../entities/intent";

type TClassification = {
    input:string, // message
    label:string, // intent
    confidence:number
}

const INTENT_EXAMPLES:string[][] = [
    ["Do you ship internationally?", "Request for international shipping information"],
    ["Do you ship to Argentina?", "Request for international shipping information"],
    ["Hey, are there any veteran discounts?", "Request for veteran discount"],
    ["Are there any discounts?", "Request for veteran discount"],
    ["What is your return policy?", "Inquiry about return policy"],
    ["I want to return a product", "Inquiry about return policy"]
];

const INTENTS:string[] = [
    "Request for international shipping information",
    "Request for veteran discount",
    "Inquiry about return policy",
    "Inquiry about order status",
    "Request for product details",
    "Inquiry about payment methods",
    "Inquiry about shipping times",
    "Inquiry about product availability",
    "Request for cancellation of order",
    "Inquiry about account details"
];


type ProcessDataUseCaseProps = {
    intentRepository:IntentRepository,
    messageRepository:MessageRepository,
    conversationRepository:ConversationRepository
}

export default class ProcessDataUseCase {
    readonly intentRepository:IntentRepository;
    readonly messageRepository:MessageRepository;
    readonly conversationRepository:ConversationRepository;

    constructor(props:ProcessDataUseCaseProps) {
        this.intentRepository = props.intentRepository;
        this.messageRepository = props.messageRepository;
        this.conversationRepository = props.conversationRepository;
    }

    public async execute(stream:Readable):Promise<void> {
        const messages:Message[] = await csvtojson().fromStream(stream);

        var classifications:TClassification[] = await this.classifyIntents(messages);

        for ( var i:number = 0; i < classifications.length; i++ ) {
            let classification:TClassification = classifications[i];
            let message:Message = messages[i];
            let conversation:Conversation = await this.findByMessage(message);

            message.conversationId = conversation.id!;
            message.intent = classification.label;

            if (classification.confidence < 0.80) {
                this.createClarification(message);
                continue
            }
    
            this.createResponse(message)
        }
    }

    private async classifyIntents(m:Message[]) {
        const EDEN_API_URL = "https://api.edenai.run/v2/text/custom_classification";
        const intents:Intent[] = await this.fetchIntents();
        
        return await axios.post(EDEN_API_URL, {
                providers: "cohere",
                examples: INTENT_EXAMPLES,
                texts: m.map( (v:Message) => v.message ),
                labels: intents
            }, {
                headers: {
                    authorization: `Bearer ${process.env.EDENAI_API_KEY}`
                }
            }).then( (res) => {
                if (res.data.cohere?.error) {
                    throw res.data.cohere?.error
                }

            return res.data.cohere.classifications as TClassification[]
        } ).catch( (err) => {
            throw err
        })
    }

    private async findByMessage(m:Message):Promise<Conversation> {
        return await this.conversationRepository.findByParticipants(m.sender_username, m.reciever_username);
    }

    private createClarification(m:Message) {
        m.message = "I don't understand. Could you please clarify?"
        this.messageRepository.create(m);
    }

    private createResponse(m:Message) {
        var response = {
            sender_username: m.sender_username,
            reciever_username: m.reciever_username,
            conversationId: m.conversationId,
            channel: m.channel,
            intent: m.intent
        } as Message

        if (m.intent == "Request for international shipping information") {
            response.message = `Hey ${m.sender_username}, we do ship internationally. Could you provide you full address?`
        }

        this.messageRepository.create(response);
    }

    private fetchIntents():Promise<Intent[]> {
        return this.intentRepository.findAll()
    }
    
}
