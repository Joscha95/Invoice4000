

class Notification{
  isDead = false;
  life?:number; 
  onKill:Function;
  message:Message;
  
  id:string;
  constructor(message:Message,onKill:Function,id:string){
    this.message = message;
    this.onKill = onKill;
    this.id = id;
    this.life = this.message.type != 'Warning' && this.message.type != 'Error' ? 3 : undefined;
    if (this.life) {
      setTimeout(()=>{this.kill()},this.life*1000)
    }
  }

  kill(){
    this.isDead = true;
    this.onKill();
  }
}

export default Notification;