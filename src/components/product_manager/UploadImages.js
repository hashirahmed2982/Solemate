import React, { useState } from 'react';
import { storage } from '../../firebase';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';


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

function UploadImages(props) {
    const [images, setImages] = useState([]);
    const [urls, setUrls] = useState([]);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleChange = e => {
        console.log('ID UPLOADIMAGES: ', props.ID);
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
            const uploadTask = storage.ref(`/products/00001/${image.name}`).put(image);
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
                    await storage.ref('products/00001').child(image.name).getDownloadURL().then((urls) => {
                        console.log(urls)
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
                        <Typography variant='h5'>Product Pictures</Typography>
                    </Paper>
                    
                    
                    
                    <Box display='flex' padding={3}>
                        <label htmlFor="icon-button-file">
                            <Input accept="image/*" id="icon-button-file" multiple onChange={handleChange} type="file" />
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
                            Select Images to Upload
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
    )
}

export default UploadImages