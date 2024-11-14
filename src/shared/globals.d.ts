declare global{
  type messageType = 'Error' | 'Warning' | 'Neutral' | 'Success';
  
  type Message = {
    type: messageType,
    text:string,
    contents?:any
  }
}

export {}