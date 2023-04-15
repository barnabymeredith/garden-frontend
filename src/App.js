import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useEffect, useState } from "react";
import ImageMarker from 'react-image-marker';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import axios from 'axios';

function App() {

  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [isPictureSelected, setIsPictureSelected] = useState(false);
  const [pictures, setPictures] = useState(false);
  const [picture, setPicture] = useState(null);

  const instance = axios.create({
    baseURL: process.env.REACT_APP_backend_url,
    headers: {
      common: {
        Authorization: `Bearer ${token}`
      }
    },
    timeout: 5000,
  });

  const handleLogin = async (event, e) => {
    event.preventDefault();
    await instance
      .post('token/', {
        username: e[0],
        password: e[1]
      })
      .then(response => {
        console.log(response.data.access);
        setToken(response.data.access);
        setIsAuthenticated(true);
        setPictures()
        // Save the token to local storage or state
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleSubmit = async (event, e) => {
    event.preventDefault();
    const item = { name: e[0], description: e[1], left: e[2], top: e[3] }
    await instance
      .post('markers/', item)
    loadMarkers();
  }

  const handleDelete = async (event, id) => {
    event.preventDefault();
    await instance
      .delete('markers/' + id + "/")
    loadMarkers();
  }

  const handleEdit = async (event, e) => {
    event.preventDefault();
    const item = { name: e[1], description: e[2], left: e[3], top: e[4] }
    await instance
      .put('markers/' + e[0] + "/", item)
    loadMarkers();
  }

  const handlePicture = async (event, file_url) => {
    event.preventDefault();
    setPicture(file_url);
    setIsPictureSelected(true);
  }

  const loadMarkers = async () => {
    await instance
      .get('markers/')
      .then(
        (result) => {
          setMarkers(result.data);
        },
        (error) => {
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
      setName(props.name);
      setDescription(props.description);
    };

    if (editing) {
      return (
        <form onSubmit={event => handleEdit(event, [props.id, name, description, props.left, props.top])}>
          <label>Edit the plant name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Edit the plant description:</label>
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
        <div style={{ width: '150px' }}>
          <form onSubmit={event => handleDelete(event, [props.id])} className="position-absolute top-0 end-0">
            <input type="submit" value="X" style={{ background: 'red', static: 'right' }} />
          </form>
          <button onClick={editingModeOn} value="E" style={{ background: 'green', static: 'left', height: '25px', width: '20px' }} />
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

  const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
      <form onSubmit={event => handleLogin(event, [username, password])}>
        <label>Enter username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Enter password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" />
      </form>)
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadMarkers();
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      loadMarkers();
    }
  }, [])



  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  if (isAuthenticated) {
    if (!isPictureSelected) {
      return (
        <form onSubmit={event => handlePicture(event, ['opposite_eatery_border.jpg'])}>
        <input value="opposite eatery border" type="submit" />
      </form>
      );
    }
    else {
      return (<div style={{ width: '780px' }}>
        <ImageMarker
          src={picture}
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

}

export default App;
