import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import AddProduct from './AddProduct';

import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SizesStocksTable from './SizesStocksTable';
import { db, storage } from '../../firebase';
import Ratings from "react-ratings-declarative";
const iconPath =
  "M18.571 7.221c0 0.201-0.145 0.391-0.29 0.536l-4.051 3.951 0.96 5.58c0.011 0.078 0.011 0.145 0.011 0.223 0 0.29-0.134 0.558-0.458 0.558-0.156 0-0.313-0.056-0.446-0.134l-5.011-2.634-5.011 2.634c-0.145 0.078-0.29 0.134-0.446 0.134-0.324 0-0.469-0.268-0.469-0.558 0-0.078 0.011-0.145 0.022-0.223l0.96-5.58-4.063-3.951c-0.134-0.145-0.279-0.335-0.279-0.536 0-0.335 0.346-0.469 0.625-0.513l5.603-0.815 2.511-5.078c0.1-0.212 0.29-0.458 0.547-0.458s0.446 0.246 0.547 0.458l2.511 5.078 5.603 0.815c0.268 0.045 0.625 0.179 0.625 0.513z";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.secondary.light,
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    //justifyContent: 'space-between',
    display: 'flex',
    color: theme.palette.text.secondary.light,
    margin: '20px 20px 0px 20px',
}));

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));

function CommentTile(props) {
    const theme = useTheme();

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function deleteProduct(id) {
        db.collection('products').get()
        .then((querySnapshot) => {
            querySnapshot.forEach(async (snapshot) =>  {
                if (snapshot.id.toString() === id.toString()){
                    await db.collection('products').doc(`${id}`).delete();
                }
                }
            )
        })
        
        

    }
    
    return (
        <Item>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                <Grid item xs ={12} md={12} lg={12} xl={12}>
                    <Grid container justifyContent='space-between' sx={{padding: '10px'}}>
                        <Box>
                            <Box sx={{display: 'flex', width: '30px', height: '30px', backgroundColor: 'primary.main', borderRadius: '50%'}}>
                                <Typography variant='p' sx={{margin: 'auto', color: '#ffffff'}}>{props.comment.user[0].toString().toUpperCase()}</Typography>
                            </Box>
                            <Typography>{props.comment.user}</Typography>
                        </Box>
                        
                        <Ratings
                            rating={props.comment.rating}
                            widgetRatedColors="#f77d0b"
                            widgetSpacings="1px"
                            style={{ marginBottom: "15px" }}
                        >
                            {Array.from({ length: 5 }, (_, i) => {
                            return (
                                <Ratings.Widget
                                    key={i}
                                    widgetDimension="15px"
                                    svgIconViewBox="0 0 19 20"
                                    svgIconPath={iconPath}
                                />
                            );
                            })}
                        </Ratings>
                    </Grid>
                    
                    
                </Grid>

                <Grid item xs ={12} md={12} lg={12} xl={12}>
                    <Grid container justifyContent='space-between' sx={{padding: '10px 10px 0px 10px', backgroundColor: '#ffffff'}}>
                        <Typography sx={{lineHeight: '40px'}}>{props.comment.comment}</Typography> 
                    </Grid>
                    
                    
                </Grid>

                <Grid item xs ={12} md={12} lg={12} xl={12}>
                    <Grid container justifyContent='end' sx={{padding: '2px 10px 10px 10px'}}>
                        <Typography>{props.comment.timeStamp.toDate().toDateString()
                        + ', ' +
                        props.comment.timeStamp.toDate().toTimeString().substring(0, 8)
                        }</Typography>
                        
                    </Grid>
                    
                    
                </Grid>

                

            </Grid>
            
            
            
        </Item>
    )
}

export default CommentTile