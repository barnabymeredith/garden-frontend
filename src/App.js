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
      .post(process.env.REACT_APP_backend_url, item)
    loadMarkers();
  }

  const handleDelete = async (event, id) => {
    event.preventDefault();
    await axios
      .delete(process.env.REACT_APP_backend_url + id + "/")
    loadMarkers();
  }

  const handleEdit = async (event, e) => {
    event.preventDefault();
    const item = { name: e[1], description: e[2], left: e[3], top: e[4] }
    await axios
      .put(process.env.REACT_APP_backend_url + e[0] + "/", item)
    loadMarkers();
  }

  const loadMarkers = () => {
    fetch(process.env.REACT_APP_backend_url)
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
    const [editing, setEditing] = useState(false);

    const editingModeOn = () => {
      setEditing(true);
    };

    if (editing) {
      return (
        <form onSubmit={event => handleEdit(event, [props.id, name, description, props.left, props.top])}>
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
    if (props.id) {
      return (
        <div style={ { width: '150px' } }>
          <form onSubmit={event => handleDelete(event, [props.id])} className="position-absolute top-0 end-0">
            <input type="submit" value="X" style={ { background: 'red', static: 'right'} } />
          </form>
          <button onClick={editingModeOn} value="E" style={ { background: 'green', static: 'left', height: '25px', width: '20px' } } />
          <p>{props.name}</p>
          <p>{props.description}</p>
        </div>
      )
    }
    if (!props.id) {
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
      <div style={{ width: '780px' }}>
        <ImageMarker
          src={require('./image01.jpg')}
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
