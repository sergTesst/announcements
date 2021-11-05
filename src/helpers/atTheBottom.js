
export const atTheBottom = () => {
  
  const heightAndOffset = Math.ceil(window.innerHeight + window.pageYOffset);

  let bodyOffsetHeight = Math.floor( document.body.offsetHeight && document.documentElement.offsetHeight );
  if(bodyOffsetHeight === 0){
    bodyOffsetHeight = Math.floor( document.body.offsetHeight ||  document.documentElement.offsetHeight );
  }

  if (heightAndOffset >= bodyOffsetHeight - 5) {

    return true;
  }
  return false;
};