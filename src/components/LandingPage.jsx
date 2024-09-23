import React, { useState, useRef, useEffect } from 'react';
import { Typography, Switch, FormControlLabel, TextField, Button, Paper, List, ListItem, CircularProgress, Avatar, AppBar, Toolbar, 
  IconButton, Link, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GavelIcon from '@mui/icons-material/Gavel'; // Import Law Icon
import MicIcon from '@mui/icons-material/Mic'; // Import Mic Icon
import axios from 'axios'; // Import Axios
import './LandingPage.css';

const AIAvatar = () => (
  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
    <GavelIcon /> {/* Updated to use Law Icon */}
  </Avatar>
);

function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const [showQuestions, setShowQuestions] = useState(false); // State to toggle question visibility
  const [currentQuestion, setCurrentQuestion] = useState(null); // State to track the current question
  const [aiResponseLength, setAiResponseLength] = useState(0);
  const [topMatches, setTopMatches] = useState([]); 
  const [selectedContent, setSelectedContent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const chatContainerRef = useRef(null); // Reference for the chat container

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const fetchAIResponse = async (userInput) => {
    try {
      console.log('Sending request to API...');
      const response = await axios.get(`http://localhost:8000/search?query=${encodeURIComponent(userInput)}`);
      console.log('Received response:', response.data);

      // Extract 'summarized_answer' and 'top_matches'
      const aiResponse = response.data.summarized_answer || "Sorry, I couldn't generate a response.";
      const matches = response.data.top_matches || [];

      setAiResponseLength(aiResponse.length);
      setTopMatches(matches); // Update the 'topMatches' state
      return aiResponse;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      // Include the error message in the response
      return `Sorry, I couldn't generate a response due to an error: ${error.message}. ${error.response ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : ''}`;
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      setIsChatVisible(true);
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      setIsLoading(true);

      // Fetch AI response
      const aiResponse = await fetchAIResponse(input);
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    // Implement the functionality for handling mic click (e.g., start voice recognition)
    console.log('Mic button clicked');
  };

  const questions = [ // Sample questions related to Indian Law
    "What is the process of filing a FIR?",
    "What are the rights of a tenant in India?",
    "How to file a divorce in India?",
    "What is the procedure for property registration?"
  ];

  const suggestionsMap = { // Map of questions to their suggestions
    "What is the process of filing a FIR?": [
      "What documents are needed to file a FIR?",
      "How long does it take to file a FIR?",
      "What to do if the police refuse to file a FIR?"
    ],
    "What are the rights of a tenant in India?": [
      "What is the eviction process for tenants?",
      "What are the tenant's rights regarding repairs?",
      "How can a tenant claim their security deposit?"
    ],
    "How to file a divorce in India?": [
      "What are the grounds for divorce in India?",
      "How long does the divorce process take?",
      "What are the legal requirements for filing a divorce?"
    ],
    "What is the procedure for property registration?": [
      "What documents are required for property registration?",
      "How long does property registration take?",
      "What are the fees involved in property registration?"
    ]
  };

  const handleQuestionClick = (question) => {
    setCurrentQuestion(question); // Set the current question to show its suggestions
  };

  const handleMatchClick = (match) => {
    setSelectedContent(match);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    // Scroll to bottom of the chat container
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Dynamically adjust chat container height
    if (chatContainerRef.current) {
      chatContainerRef.current.style.height = 'auto';
      chatContainerRef.current.style.height = `${chatContainerRef.current.scrollHeight}px`;
    }
  }, [messages]);

  return (
    <div className={`landing-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`} style={{display: 'flex', flexDirection: 'column', minHeight: '93vh', overflow: 'hidden'}}> {/* Full height */}
      <AppBar position="static" sx={{ 
        borderRadius: '40px 40px 40px 40px', 
        backgroundColor: isDarkMode ? '#333' : '#fff', 
        padding: '5px', 
        width: '55%', // Decreased width to 55%
        margin: '20px auto 0', // Add top margin for gap and center the AppBar
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // Optional: Add shadow for depth
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}> {/* Updated for equal spacing */}
            <Button variant="outlined" sx={{ 
              borderRadius: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              color: isDarkMode ? '#fff' : '#000', 
              border: 'none', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)', // Updated shadow to match theme button
              background: isDarkMode ? 'linear-gradient(45deg, #444, #666)' : 'linear-gradient(45deg, #f0f0f0, #fff)', 
              fontSize: '0.9rem', 
              padding: '5px 15px', 
              minWidth: '100px', 
              transition: 'all 0.3s ease', 
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)', // Updated hover shadow
              }
            }}>
              <Avatar sx={{ bgcolor: 'transparent', marginRight: 1, width: 20, height: 20 }}>🚪</Avatar> Home
            </Button>
            <Button variant="outlined" sx={{ 
              borderRadius: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              color: isDarkMode ? '#fff' : '#000', 
              border: 'none', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)', // Updated shadow to match theme button
              background: isDarkMode ? 'linear-gradient(45deg, #444, #666)' : 'linear-gradient(45deg, #f0f0f0, #fff)', 
              fontSize: '0.9rem', 
              padding: '5px 15px', 
              minWidth: '100px', 
              transition: 'all 0.3s ease', 
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)', // Updated hover shadow
              }
            }}>
              <Avatar sx={{ bgcolor: 'transparent', marginRight: 1, width: 20, height: 20 }}>🔍</Avatar> Discover
            </Button>
            <Button variant="outlined" sx={{ 
              borderRadius: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              color: isDarkMode ? '#fff' : '#000', 
              border: 'none', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)', // Updated shadow to match theme button
              background: isDarkMode ? 'linear-gradient(45deg, #444, #666)' : 'linear-gradient(45deg, #f0f0f0, #fff)', 
              fontSize: '0.9rem', 
              padding: '5px 15px', 
              minWidth: '100px', 
              transition: 'all 0.3s ease', 
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)', // Updated hover shadow
              }
            }}>
              <Avatar sx={{ bgcolor: 'transparent', marginRight: 1, width: 20, height: 20 }}>🏢</Avatar> About
            </Button>
            <Button variant="outlined" sx={{ 
              borderRadius: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              color: isDarkMode ? '#fff' : '#000', 
              border: 'none', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)', // Updated shadow to match theme button
              background: isDarkMode ? 'linear-gradient(45deg, #444, #666)' : 'linear-gradient(45deg, #f0f0f0, #fff)', 
              fontSize: '0.9rem', 
              padding: '5px 15px', 
              minWidth: '100px', 
              transition: 'all 0.3s ease', 
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)', // Updated hover shadow
              }
            }}>
              <Avatar sx={{ bgcolor: 'transparent', marginRight: 1, width: 20, height: 20 }}>🔑</Avatar> Sign In
            </Button>
            <Button variant="outlined" sx={{ 
              borderRadius: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              color: isDarkMode ? '#fff' : '#000', 
              border: 'none', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)', // Updated shadow to match theme button
              background: isDarkMode ? 'linear-gradient(45deg, #444, #666)' : 'linear-gradient(45deg, #f0f0f0, #fff)', 
              fontSize: '0.9rem', 
              padding: '5px 15px', 
              minWidth: '100px', 
              transition: 'all 0.3s ease', 
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)', // Updated hover shadow
              }
            }} onClick={toggleDarkMode}>
              <Avatar sx={{ bgcolor: 'transparent', marginRight: 1, width: 24, height: 24 }}>
                {isDarkMode ? '🌙' : '☀️'}
              </Avatar>
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <div style={{flexGrow: 1, padding: '20px', overflowY: 'auto'}}> {/* Main content area */}
        <div className="main-content">
          <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '3rem', md: '4rem' }, color: isDarkMode ? 'white' : 'black', marginTop: '5rem' }}>
            Brief Barrister
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom sx={{ color: isDarkMode ? 'white' : 'black' }}>
            Where Knowledge Meets Justice
          </Typography>
          <div className="chat-container" ref={chatContainerRef} sx={{ marginBottom: '1rem', backgroundColor: 'transparent', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '1rem', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                placeholder="Ask your Query..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                sx={{ 
                  mr: 1, 
                  flexGrow: 1, 
                  borderRadius: '50px', 
                  backgroundColor: isDarkMode ? '#424242' : '#f5f5f5', 
                  boxShadow: 2, // Added shadow
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '50px', 
                    '& fieldset': {
                      border: 'none', // Remove border
                    },
                    '&:hover fieldset': {
                      border: 'none', 
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none', 
                    },
                    '&:focus': {
                      outline: 'none', // Remove outline on focus
                    },
                    color: isDarkMode ? '#fff' : '#000' // Adjust text color based on theme
                  },
                }} 
              />
              <IconButton 
                color="primary" 
                onClick={handleSend} 
                sx={{ 
                  borderRadius: '50%', 
                  backgroundColor: isDarkMode ? '#444' : '#f0f0f0', 
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#555' : '#e0e0e0', // Hover effect
                  },
                  marginLeft: '5px' // Space between text field and button
                }}
              >
                <SendIcon />
              </IconButton>
              <IconButton 
                color="primary" 
                onClick={handleMicClick} // Add a function to handle mic click
                sx={{ 
                  borderRadius: '50%', 
                  backgroundColor: isDarkMode ? '#444' : '#f0f0f0', 
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#555' : '#e0e0e0', // Hover effect
                  },
                  marginLeft: '5px' // Space between buttons
                }}
              >
                <MicIcon />
              </IconButton>
            </div>
            {isChatVisible && (
              <Paper elevation={3} sx={{ 
                padding: 2, 
                backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5', 
                borderRadius: '20px', 
                flexGrow: 1, 
                marginBottom: '20px', // Add some space at the bottom
              }}>
                <List sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '100%',
                  overflowY: 'auto', // Removed 'hidden' to enable scrollbar
                }}>
                  {messages.map((message, index) => (
                    <ListItem key={index} sx={{ 
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start', // Align items to the top
                    }}>
                      {message.sender === 'ai' && <AIAvatar />}
                      <Paper sx={{ 
                        padding: 2, 
                        borderRadius: 2, 
                        backgroundColor: message.sender === 'user' ? 'primary.main' : (message.isThinking ? 'grey.400' : (isDarkMode ? '#424242' : '#e0e0e0')), 
                        color: message.sender === 'user' ? 'white' : (isDarkMode ? 'white' : 'black'),
                        maxWidth: message.sender === 'ai' ? '90%' : '80%', // Increase max width for AI responses
                        wordBreak: 'break-word', // Allow long words to break
                      }}>
                        {message.text}
                      </Paper>
                    </ListItem>
                  ))}
                  {isLoading && (
                    <ListItem>
                      <CircularProgress size={24} />
                    </ListItem>
                  )}
                </List>
                {topMatches.length > 0 && (
                  <div style={{marginTop: '16px'}}> 
                    <Typography variant="h6" sx={{ mt: 1 }}>Top Matches:</Typography>
                    <List>
                      {topMatches.map((match, index) => (
                        <ListItem key={index} 
                          sx={{
                            backgroundColor: 'transparent', // Set background to transparent
                            marginBottom: '8px',
                            borderRadius: '4px'
                          }}>
                          <Link
                            component="button"
                            variant="body2"
                            onClick={() => handleMatchClick(match)}
                            sx={{
                              color: isDarkMode ? '#90caf9' : '#1976d2',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            {match.page_content.substring(0, 200)}...
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </Paper>
            )}
          </div>
          <div>
            <Button 
              variant="text" // Use 'text' variant for a link-like appearance
              onClick={() => setShowQuestions(!showQuestions)} 
              sx={{ 
                backgroundColor: 'transparent', // Remove background
                border: 'none', // Remove border
                color: isDarkMode ? '#90caf9' : '#1976d2', // Change text color based on theme
                fontSize: '0.8rem', // Decrease font size
                padding: '0', // Remove padding for a more compact button
                textTransform: 'none', // Prevent text from being uppercase
                '&:hover': {
                  backgroundColor: 'transparent', // Ensure no background on hover
                  color: isDarkMode ? '#bbdefb' : '#64b5f6', // Change hover color
                }
              }}
            >
              Filter Questions
            </Button>
            {showQuestions && (
              <div>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: isDarkMode ? '#90caf9' : '#1976d2', // Change color based on theme
                    marginBottom: '1rem', // Add some space below
                    fontFamily: 'Arial, sans-serif', // Change font family
                  }}
                >
                  Available Questions
                </Typography>
                <List>
                  {questions.map((question, index) => (
                    <ListItem 
                      button 
                      key={index} 
                      onClick={() => handleQuestionClick(question)} 
                      sx={{ 
                        padding: '10px', // Add padding for better spacing
                        borderRadius: '8px', // Rounded corners
                        '&:hover': {
                          backgroundColor: isDarkMode ? '#444' : '#f0f0f0', // Change background on hover
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Add shadow on hover
                        },
                        fontFamily: 'Arial, sans-serif', // Change font family
                        color: isDarkMode ? 'white' : 'black', // Change text color based on theme
                      }}
                    >
                      {question}
                    </ListItem>
                  ))}
                </List>
                {currentQuestion && (
                  <div>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: isDarkMode ? '#90caf9' : '#1976d2', // Change color based on theme
                        marginTop: '1rem', // Add some space above
                        fontFamily: 'Arial, sans-serif', // Change font family
                      }}
                    >
                      Suggestions for: {currentQuestion}
                    </Typography>
                    <List>
                      {suggestionsMap[currentQuestion].map((suggestedQuestion, index) => (
                        <ListItem 
                          button 
                          key={index} 
                          onClick={() => handleQuestionClick(suggestedQuestion)} 
                          sx={{ 
                            padding: '10px', // Add padding for better spacing
                            borderRadius: '8px', // Rounded corners
                            '&:hover': {
                              backgroundColor: isDarkMode ? '#444' : '#f0f0f0', // Change background on hover
                              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Add shadow on hover
                            },
                            fontFamily: 'Arial, sans-serif', // Change font family
                            color: isDarkMode ? 'white' : 'black', // Change text color based on theme
                          }}
                        >
                          {suggestedQuestion}
                        </ListItem>
                      ))}
                    </List>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        sx={{ 
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              backgroundColor: isDarkMode ? '#212121' : '#f5f5f5', // Match the background color with the theme
              borderRadius: '20px', // Rounded corners for the dialog
              boxShadow: '5px 5px 20px rgba(0, 0, 0, 0.2)', // Add a shadow for visual depth
            },
            '& .MuiDialogContent-root': {
              padding: '16px', // Reduced padding to 16px
              color: isDarkMode ? '#fff' : '#000', // Set text color based on theme
            },
            '& .MuiDialogTitle-root': {
              padding: '5px 10px', // Reduced padding to 5px 10px
              textAlign: 'center', // Center the title
              color: isDarkMode ? '#90caf9' : '#1976d2', // Set title color based on theme
            },
            '& .MuiDialogActions-root': {
              padding: '5px 10px', // Reduced padding to 5px 10px
              justifyContent: 'center', // Center the buttons
            },
          },
          '& .MuiTypography-h6': {
            color: isDarkMode ? '#90caf9' : '#1976d2', // Title color based on the theme
            fontWeight: 'bold', // Make the title bold
          },
          '& .MuiButton-root': {
            padding: '8px 15px', // Reduced padding to 8px 15px
            borderRadius: '20px', // Rounded corners for buttons
            fontSize: '0.7rem', // Reduced font size
            color: isDarkMode ? '#fff' : '#000', // Set button text color based on theme
            '&:hover': {
              backgroundColor: isDarkMode ? '#444' : '#e0e0e0', // Hover effect for buttons
            },
          },
          '& .MuiDialogContent-root': {
            overflow: 'auto', // Enable scrolling for the dialog content if needed
          }
        }} // Use sx prop for the dialog styling
      >
        <DialogTitle id="scroll-dialog-title">Full Details</DialogTitle>
        <DialogContent dividers={true}>
          <Typography>
            {selectedContent?.page_content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LandingPage;