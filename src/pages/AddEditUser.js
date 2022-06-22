import {
  addDoc,
  collection,
  updateDoc,
  getDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { storage, db } from "../firebase";

const initialState = {
  name: "",
  email: "",
  info: "",
  contact: "",
};

const AddEditUser = () => {
  const [data, setData] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { name, email, info, contact } = data;

  useEffect(() => {
    const getSingleUser = async () => {
      const docRef = doc(db, "users", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setData({ ...snapshot.data() });
      }
    };
    id && getSingleUser();
  }, [id]);

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is Paused!");
              break;
            case "running":
              console.log("Uploading...");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const validate = () => {
    const errors = {};
    if (!name) {
      errors.name = "Name is Required";
    }
    if (!email) {
      errors.email = "Email is Required";
    }
    if (!info) {
      errors.info = "Info is Required";
    }
    if (!contact) {
      errors.contact = "Contact is Required";
    }
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);
    if (!id) {
      try {
        await addDoc(collection(db, "users"), {
          ...data,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await updateDoc(doc(db, "users", id), {
          ...data,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    }
    navigate("/");
  };
  return (
    <>
      <Grid
        centered
        verticalAlign="middle"
        columns="3"
        style={{ height: "80vh" }}
      >
        <Grid.Row>
          <Grid.Column textAlign="center">
            <div>
              {isSubmit ? (
                <Loader active inline="centered" size="huge" />
              ) : (
                <>
                  <h2>{id ? "Update User" : "Add User"}</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Input
                      label="Name"
                      error={errors.name ? { content: errors.name } : null}
                      placeholder="Enter Name"
                      name="name"
                      onChange={handleChange}
                      value={name}
                      autoFocus
                    />
                    <Form.Input
                      label="Email"
                      error={errors.email ? { content: errors.email } : null}
                      placeholder="Enter Email"
                      name="email"
                      onChange={handleChange}
                      value={email}
                    />
                    <Form.TextArea
                      label="Info"
                      error={errors.info ? { content: errors.info } : null}
                      placeholder="Enter Info"
                      name="info"
                      onChange={handleChange}
                      value={info}
                    />
                    <Form.Input
                      label="Contact"
                      error={
                        errors.contact ? { content: errors.contact } : null
                      }
                      placeholder="Enter Contact"
                      name="contact"
                      onChange={handleChange}
                      value={contact}
                    />
                    <Form.Input
                      label="Upload"
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                      primary
                      type="submit"
                      disabled={progress !== null && progress < 100}
                    >
                      Submit
                    </Button>
                  </Form>
                </>
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default AddEditUser;
