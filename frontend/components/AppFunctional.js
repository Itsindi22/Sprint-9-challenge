import React, { useState } from 'react';

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  // State variables
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);



  function getXY() {
    // It is not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = (index % 3) + 1; // X-coordinate (1, 2, 3)
    const y = Math.floor(index / 3) + 1; // Y-coordinate (1, 2, 3)
    return { x, y };
  }

  function getXYMessage() {
    // It is not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the getXY helper above to obtain the coordinates, and then getXYMessage
    // returns the fully constructed string.
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setIndex(initialIndex);
    setSteps(initialSteps);
    setMessage(initialMessage);
    setEmail(initialEmail);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.

    let newIndex = index;

    switch (direction) {
      case 'left':
        if (index % 3 !== 0) {
          newIndex -= 1; // Move left unless at the left edge
        } else {
          setMessage(`You can't go left`);
        }
        break;

      case 'right':
        if (index % 3 !== 2) {
          newIndex += 1; // Move right unless at the right edge
        } else {
          setMessage(`You can't go right`);
        }
        break;

      case 'up':
        if (index >= 3) {
          newIndex -= 3; // Move up unless at the top edge
        } else {
          setMessage(`You can't go up`);
        }
        break;

      case 'down':
        if (index < 6) {
          newIndex += 3; // Move down unless at the bottom edge
        } else {
          setMessage(`You can't go down`);
        }
        break;

      default:
        break;
    }

    return newIndex;
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    const newIndex = getNextIndex(direction);

    if (newIndex !== index) {
      setIndex(newIndex);
      setSteps(steps + 1);
      setMessage(''); // Clear any error messages when a valid move is made
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();

    const { x, y } = getXY();
    const payload = {
      x,
      y,
      steps,
      email,
    };

    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        setEmail(''); // Clear email field after submission
      })
      .catch(() => {
        setMessage('Error sending data');
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} time{steps === 1 ? '' : 's'}</h3>
      </div>
      <div id="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '5px', margin: '20px auto', width: 'max-content' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} 
               className={`square${idx === index ? ' active' : ''}`} 
              >
            {idx === index ? 'B' : ''}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>RESET</button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange}
        />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}
