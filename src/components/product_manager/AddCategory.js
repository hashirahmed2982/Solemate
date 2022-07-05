import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Grid from "@material-ui/core/Grid";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import { Stack } from "@mui/material";
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { db, storage } from '../../firebase';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import firebase from 'firebase';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: 400, }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} sx={{  }}/>
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const Input = styled('input')({
    display: 'none',
});

const defaultValues = {
  ID: '',
  name: "",
};

export default function AddCategory() {
  const [open, setOpen] = React.useState(false);
  const [ID, setID] = React.useState('');

  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [formValues, setFormValues] = useState(defaultValues);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSubmitClose = () => {
    setUrls([]);
    setImages([]);
    setProgress([0]);
    setUploading(false);
    setFormValues(defaultValues);
    setID('');
    setOpen(false);
  }

  async function handleClose () {
    if (urls.length > 0){
        const storageRef = storage.ref(`products/${ID}/`);
        await storageRef.listAll().then((listResults) => {
            const promises = listResults.items.map((item) => {
                return item.delete();
            });
            Promise.all(promises);
        });
    }
    setUrls([]);
    setImages([]);
    setProgress([0]);
    setUploading(false);
    setFormValues(defaultValues);
    setID('');
    setOpen(false);
  };

  useEffect(() => {
    var tempID = '';
    const min = 0;
    const max = 9;

    for (var i = 0; i < 8; i++) {
      tempID += (Math.floor(min + Math.random() * (max - min))).toString();
    }
    setID(tempID);
    setFormValues({
        ...formValues,
        ID: ID,
    });
  }, [open])

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormValues({
      ...formValues,
      [name]: value,
      });
  };

  async function handleSubmit(event) {
      //console.log(firebase.firestore.Timestamp.now().toDate().toString());
      
      event.preventDefault();
      console.log(formValues);
      // add firebase entry
      await db.collection('categories').doc(`${ID}`).set({
          name: formValues.name,
          ID: ID,
          url: urls[0],
      }).then(() => {
        handleSubmitClose();
      })

  };

  ////////////////////////////
  const handleChange = e => {
      setUploading(false);
      for (let i=0; i < e.target.files.length; i++){
          const newImage = e.target.files[i];
          newImage['id'] = Math.random();
          setImages((prevState) => [...prevState, newImage]);
      }
  };

  const handleUpload = () => {
      setUploading(true);
      const promises = [];
      images.map((image) => {
          const uploadTask = storage.ref(`/categories/${ID}/`).put(image);
          promises.push(uploadTask);
          uploadTask.on(
              "state_changed",
              snapshot => {
                  const progress = Math.round(
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  );
                  setProgress(progress);
              },
              error => {
                  console.log(error);
              },
              async () => {
                  await storage.ref(`categories/`).child(ID).getDownloadURL().then((urls) => {
                      //console.log(urls)
                      setUrls((prevState) => [...prevState, urls]);
                  });
              }
          );
      });
      Promise.all(promises)
          .then(() => {
              setImages([]);
              setUploading(false);
          })
          .catch((err) => console.log(err));
  };
  
  return (
    <div>
      <Button variant='contained' sx={{ backgroundColor: 'primary.main', margin: '10px' }} onClick={handleClickOpen}>
          Add Category
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add Category...
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Discard
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} md={5} lg={5} xl={5}>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{justifyContent: 'center', paddingTop: '25px'}}>
                    <Stack alignItems='center'>
                        <Paper justifyContent='center'
                            sx={{
                                paddingTop: '10px',
                                paddingRight: '10px',
                                paddingBottom: '10px',
                                paddingLeft: '10px',
                                backgroundColor: 'secondary.light'
                            }}
                        >
                            <Typography variant='h5'>Category Picture</Typography>
                        </Paper>
                        
                        <Divider flexItem sx={{padding:'0.25px', margin: '20px'}}/>
                        
                        <Box display='flex' padding={3}>
                            <label htmlFor="icon-button-file">
                                <Input accept="image/*" id="icon-button-file" onChange={handleChange} type="file" />
                                <Button component="span">
                                    <Paper justifyContent='center'
                                        sx={{
                                            paddingTop: '30px',
                                            paddingRight: '30px',
                                            paddingBottom: '30px',
                                            paddingLeft: '30px',
                                            opacity: 0.8,
                                            boxShadow: 'none',
                                            border: '1px dashed #9e9e9e'
                                        }}>
                                        <AddAPhotoIcon sx={{fontSize: '80px'}} />
                                    </Paper>
                                    
                                </Button>
                            </label>
                            
                        </Box>
                        {images.length > 0 ? <Typography  variant='h6' alignContent='center' alignItems='center' component='span' padding={2}>{images.length} image(s) selected...</Typography> 
                        : <Typography alignContent='center' alignItems='center' component='span' padding={2}>&nbsp;</Typography>}
                        
                        {uploading == true ? 
                            <CircularProgress sx={{color: 'secondary.main', marginBottom: 3}} /> : 
                            images.length > 0  ? 
                            <Button variant="contained" onClick={handleUpload} endIcon={<SendIcon />} sx={{marginBottom: 3}}>
                                Upload
                            </Button> : 
                            <Button variant="contained" disabled onClick={handleUpload} sx={{marginBottom: 3}}>
                                Uploaded
                            </Button>  
                        }

                        {progress > 0 ? <LinearProgressWithLabel value={progress}/> : <span></span>}
                        {urls.length > 0 ? <Typography variant='h6' padding={3} alignContent='center' alignItems='center' component='span' >{urls.length} image(s) added...</Typography> : <span></span>}
                    </Stack>
                </Box>
                {urls.length > 0 ? 
                <Paper justifyContent='center'
                    sx={{
                        paddingTop: '10px',
                        paddingRight: '10px',
                        paddingBottom: '10px',
                        paddingLeft: '10px',
                    }}
                >
                    <Grid sx={{ flexGrow: 1 }} container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container justifyContent="center" spacing={2} paddingTop={5} paddingBottom={5}>
                                {urls.map((url, i) => (
                                    <Grid key={i} item>
                                        <Paper justifyContent='center'
                                            sx={{
                                                paddingTop: '10px',
                                                paddingRight: '10px',
                                                paddingBottom: '10px',
                                                paddingLeft: '10px',
                                                backgroundColor: 'secondary.light'
                                            }}
                                        >
                                            <img key={i} style={{ width: '200px'}} src={url || 'http://via.placeholder.com/300x400'} alt='firebase-img'></img>
                                        </Paper>
                                        
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid> 
                </Paper> :
                <span></span>
                }
                
                
            </Box>
          </Grid>
          <Grid item xs={12} md={7} lg={7} xl={7}>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{justifyContent: 'center', paddingTop: '25px'}}>
                    <Stack alignItems='center'>
                        <Paper justifyContent='center'
                            sx={{
                                paddingTop: '10px',
                                paddingRight: '10px',
                                paddingBottom: '10px',
                                paddingLeft: '10px',
                                backgroundColor: 'secondary.light'
                            }}
                        >
                            <Typography variant='h5'>Category Details</Typography>
                        </Paper>
                        
                        <Divider flexItem sx={{padding:'0.25px', margin: '20px'}}/>
                        
                        <Box sx={{ flexGrow: 1, p: 3 }}>
                            <form onSubmit={handleSubmit}>
                            <Grid justifyContent='center' container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={12} md={8} lg={8} xl={8}>
                                    <Box sx={{padding: 2}}>
                                        <Stack>
                                            <TextField
                                            id="name-input"
                                            name="name"
                                            label="Name"
                                            type="text"
                                            value={formValues.name}
                                            variant="outlined"
                                            sx={{color: 'secondary.light'}}
                                            onChange={handleInputChange}
                                            />
                                        </Stack>
                                    </Box> 
                                </Grid>
                                <Grid item xs={12} md={3} lg={3} xl={3}>
                                    <Box sx={{padding: 2}}>
                                        <Stack>
                                            <TextField
                                                disabled
                                                id="ID-input"
                                                name="ID"
                                                label="ID"
                                                value={ID}
                                                variant="outlined"
                                                sx={{color: 'secondary.light'}}
                                            />
                                        </Stack>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={10} lg={10} xl={10}>
                                    <Box sx={{paddingTop: 4, paddingLeft: 2, paddingRight: 2}}>
                                        <Stack>

                                            {urls.length > 0 && formValues.name !== '' ? 
                                                <Button variant="contained" sx={{backgroundColor: 'primary.main'}} type="submit">
                                                    Add Category
                                                </Button>
                                                :
                                                <Button variant="contained" disabled sx={{backgroundColor: 'primary.main'}} type="submit" onClick={handleSubmit}>
                                                    Add Category
                                                </Button>
                                            }
                                        </Stack>
                                    </Box>
                                    
                                </Grid>
                            </Grid>
                            </form>
                        </Box>    
                    </Stack>
                </Box>
            </Box>
          </Grid>
        </Grid>
        
      </Dialog>
    </div>
  );
}
