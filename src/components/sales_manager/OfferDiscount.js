import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
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

function OfferDiscount(props) {
  return (
      <Stack direction='row' justifyContent='space-between'>
          <Box marginRight='20px'>
            <TextField
                autoFocus
                margin="normal"
                id="currentPrice"
                label="Current Price"
                type="text"
                variant="filled"
                value={props.price}
                disabled
            />
          </Box>
          <Box>
            <TextField
                autoFocus
                margin="normal"
                id="discountedPrice"
                label="Discounted Price"
                type="text"
                variant="outlined"
            />
          </Box>
      </Stack>
  )
}

export default OfferDiscount