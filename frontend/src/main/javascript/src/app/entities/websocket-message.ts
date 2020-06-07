export class WebSocketMessage {
  type: string;
  content: any;
  entity: string;

  static fromJson(json: any): WebSocketMessage {
    const data = JSON.parse(json);

    const msg = new WebSocketMessage();

    msg.type = data.type;
    msg.entity = data.entity;
    msg.content = JSON.parse(data.content);

    return msg;
  }


}
