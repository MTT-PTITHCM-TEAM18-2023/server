const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateRandomString(length) {

    let result = '';
    const charSetLength = charSet.length;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSetLength);
      result += charSet[randomIndex];
    }
    return result;
    
}
 
  