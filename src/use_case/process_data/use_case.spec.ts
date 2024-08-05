import { afterAll, afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";
import axios from "axios";
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { createReadStream } from "fs";
import { Readable } from "stream";
import db from "../../../db/client";
import ProcessDataUseCase from "./use_case";
import { IntentRepository } from "../../repositories/intent_repository";
jest.mock("../../repositories/intent_repository")
import { MessageRepository } from "../../repositories/message_repository";
jest.mock("../../repositories/message_repository")
import { ConversationRepository } from "../../repositories/conversation_repository";
jest.mock("../../repositories/conversation_repository")

describe("ProcessData Use Case", () => {
    
    beforeAll( async () => {
  
    });

    afterEach(() => {
        mockedAxios.mockReset()
        jest.restoreAllMocks();
    });
    

    it("creates responses from intents", async () => {
        const intentRepository:IntentRepository = new IntentRepository(db);
        const messageRepository:MessageRepository = new MessageRepository(db);
        const conversationRepository:ConversationRepository = new ConversationRepository(db);

        jest.mocked(messageRepository.create).mockReturnValue({ sender_username: "", reciever_username: "", message: "", channel: "instagram", conversationId: 0, intentID: 0, intent: "" });
        jest.mocked(conversationRepository.findByParticipants).mockResolvedValue({
            id: 1,
            sender_username: "",
            receiver_username: ""
        })
        jest.mocked(intentRepository.findAll).mockResolvedValue([{
            name: "Inquiry about account details"
        }])
        
        var stream:Readable = createReadStream(`${__dirname}/../../../spec/files/sample.csv`);
        var useCase:ProcessDataUseCase = new ProcessDataUseCase({
            intentRepository, 
            messageRepository,
            conversationRepository
        });

        mockedAxios.post.mockReturnValue(new Promise( (resolver, _) => {
            resolver({
                data: {
                    cohere: {
                        classifications: [
                            { input: 'how are you doing?', label: 'Request for veteran discount', confidence: 0.5461715 },
                            { input: 'do you ship internationally?', label: 'Request for international shipping information', confidence: 0.999271 },
                        ]
                    }
                }
            })
        } ))

        return useCase.execute(stream).then( async () => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                "https://api.edenai.run/v2/text/custom_classification",
                expect.objectContaining({
                    labels: await intentRepository.findAll()
                }),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        authorization: expect.stringContaining("Bearer")
                    })
                })
            )
            expect(messageRepository.create).toHaveBeenCalledWith({
                "channel": "instagram", 
                "intent": "Request for veteran discount", 
                "message": "I don't understand. Could you please clarify?", 
                "reciever_username": "@helloworld", 
                "sender_username": "@bogoman",
                "conversationId": 1
            });

            expect( messageRepository.create ).toHaveBeenCalledWith({
                "channel": "facebook", 
                "intent": "Request for international shipping information", 
                "message": "Hey @ashdev, we do ship internationally. Could you provide you full address?", 
                "reciever_username": "@meowcat", 
                "sender_username": "@ashdev",
                "conversationId": 1
            });

            expect( intentRepository.findAll ).toHaveBeenCalled();
        })
    }) 
});
