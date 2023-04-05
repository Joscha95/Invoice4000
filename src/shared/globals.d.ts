declare global{
  type messageType = 'Error' | 'Warning' | 'Neutral' | 'Success';
  
  interface Message{
    type: messageType,
    text:string,
    contents?:any
  }
}

export {}