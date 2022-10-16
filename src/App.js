import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useEffect, useState } from "react";
import ImageMarker from 'react-image-marker';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import axios from 'axios';

function App() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [markers, setMarkers] = useState([]);

  const handleSubmit = async (event, e) => {
    event.preventDefault();
    const item = { name: e[0], description: e[1], left: e[2], top: e[3] }
    await axios
      .post("/api/markers/", item)
    loadMarkers();
  }

  const handleDelete = async (event, id) => {
    event.preventDefault();
    await axios
      .delete("/api/markers/" + id)
    loadMarkers();
  }

  const loadMarkers = () => {
    fetch("/api/markers/")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setMarkers(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }

  const MarkerContent = (props) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    if (props.id) {
      return (
        <div style={ { width: '150px' } }>
          <form onSubmit={event => handleDelete(event, [props.id])} className="position-absolute top-0 end-0">
            <input type="submit" value="X" style={ { background: 'red', static: 'right'} } />
          </form>
          <p>{props.name}</p>
          <p>{props.description}</p>
        </div>
      )
    }
    else {
      return (
          <form onSubmit={event => handleSubmit(event, [name, description, props.left, props.top])}>
            <label>Enter the plant name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Enter the plant description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input type="submit" />
          </form>
      )
    }
  }

  const CustomMarker = (props) => {
    return (
      <OverlayTrigger trigger="click" placement="top" rootClose="true" overlay={
        <Popover show="true" id="popover-basic">
          <MarkerContent name={props.name} description={props.description} left={props.left} top={props.top} id={props.id} />
        </Popover>
      }>
        <p className="custom-marker"></p>
      </OverlayTrigger>
    );
  };

  useEffect(() => {
    loadMarkers();
  }, [])



  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div style={{ width: '480px' }}>
        <ImageMarker
          src={require('./pittLaneMapDraft.jpg')}
          markers={markers}
          onAddMarker={(marker) => setMarkers([...markers, marker])}
          markerComponent={CustomMarker}
          bufferLeft={4}
          bufferTop={3}
        />
      </div>
    );
  }

}

export default App;
