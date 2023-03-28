type messageType = 'Error' | 'Warning' | 'Neutral' | 'Success';

class Message{
  isDead = false;
  life?:number; 
  type:messageType;
  onKill:Function;
  message:string;
  id:string;
  constructor(message:string,onKill:Function,type:messageType = 'Neutral',id:string){
    this.message = message;
    this.onKill = onKill;
    this.type = type;
    this.id = id;
    this.life = type != 'Warning' && type != 'Error' ? 3 : undefined;
    if (this.life) {
      setTimeout(()=>{this.kill()},this.life*1000)
    }
  }

  kill(){
    this.isDead = true;
    this.onKill();
  }
}

export{ Message as default, messageType};