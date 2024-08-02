import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Container,
  Grid,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Search as SearchIcon, Person4Sharp, Mic as MicIcon, Chat as ChatIcon, Send as SendIcon, Close as CloseIcon } from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const ContentList = ({ contents, username }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [conversation, setConversation] = useState(() => {
    const savedConversation = localStorage.getItem('conversation');
    return savedConversation ? JSON.parse(savedConversation) : [];
  });
  const navigate = useNavigate();

  const apiUrl = "http://localhost:3003";

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProductValues = (id) => {
    navigate(`/products/${id}`);
  };

  const handleLogoutClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirmLogout = () => {
    handleDialogClose();
    console.log('Logout confirmed');
    navigate('/');
  };

  const handleLogout = () => {
    handleDialogClose();
    handleLogoutClick();
  };

  const handleEditProfile = () => {
    handleMenuClose();
    navigate('/view_profile');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorderInstance = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorderInstance);
      mediaRecorderInstance.start();

      mediaRecorderInstance.ondataavailable = (e) => {
        // No need to save chunks if not used
      };

      mediaRecorderInstance.onstop = () => {
        const audioBlob = new Blob([], { type: 'audio/mp3' });
        console.log("Audio Blob:", audioBlob);
        sendAudioToBackend(audioBlob);
      };

      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.mp3');
      console.log("FormData", formData);

      const response = await fetch(`${apiUrl}/api/upload-audio`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Audio sent successfully', result);
      } else {
        const error = await response.json();
        console.error('Error sending audio', error);
      }
    } catch (error) {
      console.error("Error sending audio to backend:", error);
    }
  };

  const handleChatOpen = () => {
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
    setConversation([]);
    localStorage.removeItem('conversation');
  };

  const handleChatChange = (event) => {
    setChatMessage(event.target.value);
  };

  const handleChatSubmit = async () => {
    const newMessage = { sender: 'user', text: chatMessage };
    const updatedConversation = [...conversation, newMessage];
    setConversation(updatedConversation);
    localStorage.setItem('conversation', JSON.stringify(updatedConversation));

    try {
      const response = await fetch(`${apiUrl}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: chatMessage }),
      });

      setTimeout(async () => {
        const data = await response.json();
        setChatMessage('');

        const botMessage = { sender: 'bot', text: data.answer };
        const updatedConversationWithBot = [...updatedConversation, botMessage];
        setConversation(updatedConversationWithBot);
        localStorage.setItem('conversation', JSON.stringify(updatedConversationWithBot));
      }, 2000);
    } catch (error) {
      console.error("Error fetching chat responses:", error);
    }
  };

  const filteredContents = contents.filter(
    (content) =>
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
            Product List
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Search>
          <IconButton edge="end" onClick={handleProfileMenuOpen} color="inherit">
            <Person4Sharp />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEditProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '100px' }}>
        <Grid container spacing={3}>
          {filteredContents.map((content) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={content._id}
              onClick={() => handleProductValues(content._id)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <Avatar
                  alt={content.title}
                  src={content.imageUrl}
                  style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
                />
                <Typography variant="h6">{content.title}</Typography>
                <Typography variant="h6">{content.instructor}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Price: ${content.price}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {content.description}
                </Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton
        onClick={handleChatOpen}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#007bff',
          color: 'white',
        }}
      >
        <ChatIcon />
      </IconButton>
      <Dialog
        open={chatOpen}
        onClose={handleChatClose}
        aria-labelledby="Any queries?"
        aria-describedby="chat-dialog-description"
        style={{ position: 'relative' }}
      >
        <DialogContent>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleChatClose}
            style={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">How can I help you, {username}?</Typography>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <List>
              {conversation.map((message, index) => (
                <ListItem
                  key={index}
                  style={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  <Paper
                    style={{
                      padding: '10px',
                      backgroundColor: message.sender === 'user' ? '#e0e0e0' : '#007bff',
                      color: message.sender === 'user' ? 'black' : 'white',
                      alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '5px',
                      borderRadius: '10px',
                    }}
                  >
                    <ListItemText primary={message.text} />
                  </Paper>
                </ListItem>
              ))}
            </List>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              autoFocus
              margin="dense"
              id="chatMessage"
              label="Type your message"
              type="text"
              fullWidth
              variant="outlined"
              value={chatMessage}
              onChange={handleChatChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleChatSubmit();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={recording ? stopRecording : startRecording}
                      color="primary"
                    >
                      <MicIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <IconButton
              edge="end"
              onClick={handleChatSubmit}
              color="primary"
            >
              <SendIcon />
            </IconButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentList;
