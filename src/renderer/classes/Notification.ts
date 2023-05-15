

class Notification{
  isDead = false;
  life?:number; 
  remainingLife?:number;
  onKill:Function;
  message:Message;
  id:string;
  timestamp?:number
  timeout?:NodeJS.Timeout

  private _isFirst:boolean = false;
  public set isFirst(val:boolean){
    
    if(val == this._isFirst || !this.remainingLife) return;
    this._isFirst = val;
    if(this.timeout && !this._isFirst){
      /// calculate remaining lifetime: subtract already lived time from overall lifetime
      this.remainingLife = this.timestamp ? this.remainingLife - (Date.now() - this.timestamp) : this.life;
      clearTimeout(this.timeout);
    }

    if(this._isFirst){
      this.timestamp = Date.now();
      this.timeout = setTimeout(()=>{this.kill()},this.remainingLife)
    }
    
  }
  public get isFirst():boolean{
    return this._isFirst;
  }

  constructor(message:Message,onKill:Function,id:string){
    this.message = message;
    this.onKill = onKill;
    this.id = id;
    
    this.life = this.message.type != 'Warning' && this.message.type != 'Error' ? 2000 : undefined;
    this.remainingLife = this.life;
  }

  kill(){
    this.isDead = true;
    this.onKill();
  }
}

export default Notification;