import {IEventPublish} from "./IEventPublish";

export class EventPublisher implements IEventPublish{
    publishNewLineFromStream(fileName: string, line: string): void{
        console.log(`published line ${line}`);
    }
}