import db from "../../../db/client";
import { ConversationRepository } from "../../repositories/conversation_repository";
import { IntentRepository } from "../../repositories/intent_repository";
import { MessageRepository } from "../../repositories/message_repository";
import ProcessDataUseCase from "./use_case";
import { S3Event } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from "stream";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const handler = async (event:S3Event): Promise<void> => {
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const params = { Bucket: bucket, Key: key, };
  
  var {Body} = await s3.send(new GetObjectCommand(params))

  var intentRepository:IntentRepository = new IntentRepository(db);
  var messageRepository:MessageRepository = new MessageRepository(db);
  var conversationRepository = new ConversationRepository(db);

  var useCase:ProcessDataUseCase = new ProcessDataUseCase({
      intentRepository, messageRepository, conversationRepository
  });

  if (!Body) {
    throw Error("No body");
  }

  return Body.transformToString()
    .then( (v:string) => { return Readable.from(v) })
    .then( (stream:Readable) => useCase.execute(stream) );
};
