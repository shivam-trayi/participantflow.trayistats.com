const AlertMessage = (props) => {

  let errorMessage = "";

  if (props.alertMessage.hasOwnProperty("message") && 
    props.alertMessage.message.length > 0) {
      errorMessage = props.alertMessage.message;
  } else {
    errorMessage = "Please Contact to support. Thank You"
  }

  return (
      <div>
          <h1>{errorMessage}</h1>
      </div>
  )
}

export default AlertMessage;