import React, { useState, useRef, useEffect } from 'react';
import { Typography, Switch, FormControlLabel, TextField, Button, Paper, List, ListItem, CircularProgress, Avatar, AppBar, 
  Toolbar, IconButton, Link, Dialog, DialogTitle, DialogContent, DialogActions, createTheme, ThemeProvider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GavelIcon from '@mui/icons-material/Gavel'; 
import MicIcon from '@mui/icons-material/Mic'; 
import axios from 'axios';
import './LandingPage.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { AeSdk, Node } from '@aeternity/aepp-sdk';

const AIAvatar = ({ theme }) => React.createElement(
  Avatar,
  { sx: { bgcolor: theme.palette.primary.main, width: 56, height: 56 } },
  React.createElement(GavelIcon, {})
);

const theme = createTheme({
  palette: {
    mode: 'dark', // Theme mode (light or dark)
    primary: {
      main: '#1976d2', 
    },
    secondary: {
      main: '#f50057', 
    },
    text: {
      primary: '#fff', 
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: {
      fontSize: '3rem', 
      fontWeight: 'bold', 
    },
    h4: {
      fontSize: '1.5rem', 
      fontWeight: 'normal', 
    },
    h6: {
      fontSize: '1.2rem', 
      fontWeight: 'bold', 
    },
    body1: {
      fontSize: '1rem', 
      fontWeight: 'normal', 
    },
    button: {
      textTransform: 'none', 
      fontWeight: 'normal', 
    },
  },
});

function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const [showQuestions, setShowQuestions] = useState(false); 
  const [currentQuestion, setCurrentQuestion] = useState(null); 
  const [aiResponseLength, setAiResponseLength] = useState(0);
  const [selectedContent, setSelectedContent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const chatContainerRef = useRef(null); 
  const [showFollowUp, setShowFollowUp] = useState(false); 
  const followUpInputRef = useRef(null);
  const [isSearchBarDisabled, setIsSearchBarDisabled] = useState(false); 
  const [aeSdk, setAeSdk] = useState(null);
  const [hoverContent, setHoverContent] = useState({});

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const initializeAeSdk = async () => {
      const node = await Node({ url: 'https://testnet.aeternity.io' }); // Use testnet or mainnet URL
      const sdk = await AeSdk({
        nodes: [{ name: 'testnet', instance: node }],
        compilerUrl: 'https://compiler.aepps.com', 
      });
      setAeSdk(sdk);
    };

    initializeAeSdk();
  }, []);

  const fetchArticleDetails = async (articleNumber) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/articles/${articleNumber}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching article details:", error);
      return null;
    }
  };

  const handleReferenceHover = async (event) => {
    const refNumber = event.target.dataset.ref;
    if (!hoverContent[refNumber]) {
      const articleDetails = await fetchArticleDetails(refNumber);
      if (articleDetails) {
        setHoverContent(prev => ({
          ...prev,
          [refNumber]: articleDetails
        }));
      }
    }
  };

  const fetchAIResponse = async (userInput) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/search?query="${encodeURIComponent(userInput)}"`);

      let aiResponse = response.data.summarized_answer ? 
        response.data.summarized_answer : 
        "Sorry, I couldn't generate a response."; 

      // Process the aiResponse to replace reference placeholders with styled spans
      const processedResponse = aiResponse.replace(/\[(\d+)\]/g, (match, p1) => {
        return `<span class="ref" data-ref="${p1}" onmouseenter="handleReferenceHover(event)">${p1}</span>`;
      });

      const responseWithReferences = (
        <>
          <div dangerouslySetInnerHTML={{ __html: processedResponse }} onClick={handleReferenceClick} />
          {response.data.references && response.data.references.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>References:</Typography>
              {response.data.references.map((reference, index) => (
                <Typography key={index} variant="body2" gutterBottom>
                  {index + 1}. {reference.title}
                </Typography>
              ))}
            </>
          )}
        </>
      );
      return responseWithReferences;
    } catch (error) {
      console.error("Error in fetchAIResponse:", error);
      return `Sorry, I couldn't generate a response due to an error: ${error.message}`;
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      setIsChatVisible(true);
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      setIsLoading(true);
      setIsSearchBarDisabled(true); 

      const aiResponse = await fetchAIResponse(input);

      const responseWithHeading = (
        <>
          <Typography variant="h4" sx={{ marginBottom: '1rem', color: theme}}>
            {input}
          </Typography>
          {aiResponse}
        </>
      );

      setMessages(prev => [...prev, { text: responseWithHeading, sender: 'ai' }]);
      setIsLoading(false);
      setShowFollowUp(true); 
    }
  };

  const handleMicClick = () => {
    // Implement voice recognition functionality
    console.log('Mic button clicked');
  };

  const questions = [ 
    "What is the process of filing a FIR?",
    "What are the rights of a tenant in India?",
    "How to file a divorce in India?",
    "What is the procedure for property registration?"
  ];

  const suggestionsMap = { 
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
    setCurrentQuestion(question); 
  };

  const handleMatchClick = (match) => {
    setSelectedContent(match);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFollowUpSubmit = async () => {
    const followUpInput = followUpInputRef.current.value.trim();
    if (followUpInput) {
      setMessages([...messages, { text: followUpInput, sender: 'user' }]);
      followUpInputRef.current.value = ''; 

      setIsLoading(true);
      const aiResponse = await fetchAIResponse(followUpInput);
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.style.height = 'auto';
      chatContainerRef.current.style.height = `${chatContainerRef.current.scrollHeight}px`;
    }
  }, [messages]);

  useEffect(() => {
    const addReferenceHoverListeners = () => {
      const refSpans = document.querySelectorAll('span.ref');
      refSpans.forEach((span, index) => {
        span.addEventListener('mouseenter', (event) => {
          const tooltip = document.createElement('div');
          tooltip.className = 'reference-tooltip';
          tooltip.textContent = `Reference ${index + 1}`;
          tooltip.style.position = 'absolute';
          tooltip.style.left = `${event.pageX + 10}px`;
          tooltip.style.top = `${event.pageY + 10}px`;
          tooltip.style.backgroundColor = isDarkMode ? '#424242' : '#f5f5f5';
          tooltip.style.color = isDarkMode ? 'white' : 'black';
          tooltip.style.padding = '5px';
          tooltip.style.borderRadius = '5px';
          tooltip.style.zIndex = '1000';
          document.body.appendChild(tooltip);
          
          span.addEventListener('mouseleave', () => {
            document.body.removeChild(tooltip);
          }, { once: true });
        });
      });
    };

    // Call the function after each render
    addReferenceHoverListeners();

    // Cleanup function to remove event listeners
    return () => {
      const refSpans = document.querySelectorAll('span.ref');
      refSpans.forEach(span => {
        span.replaceWith(span.cloneNode(true));
      });
    };
  }, [messages, isDarkMode]); // Re-run when messages or theme changes

  const handleReferenceClick = async (event) => {
    if (event.target.className === 'ref') {
      const refNumber = event.target.dataset.ref;
      try {
        const articleResponse = await axios.get(`http://127.0.0.1:8000/articles/${refNumber}`);
        const articleDetails = articleResponse.data;
        setSelectedContent({
          title: `Reference [${refNumber}]`,
          content: articleDetails.content,
          url: articleDetails.url
        });
        setOpenDialog(true);
      } catch (error) {
        console.error("Error fetching article details:", error);
        setSelectedContent({
          title: "Error",
          content: `Failed to fetch article details: ${error.message}`,
          url: null
        });
        setOpenDialog(true);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}> 
      <div className={`landing-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`} style={{display: 'flex', flexDirection: 'column', minHeight: '93vh', overflow: 'hidden'}}> 
        {/* AppBar with Theme-Based Background Color */}
        <AppBar
          position="static"
          sx={{
            borderRadius: '40px 40px 40px 40px',
            backgroundColor: isDarkMode ? '#000' : '#fff', // Black/White for dark/light mode
            padding: '5px',
            width: '55%',
            margin: '20px auto 0',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: '40px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                width: '100%',
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  color: isDarkMode ? '#fff' : '#000', // White/Black for dark/light mode
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  backgroundColor: isDarkMode ? '#000' : '#fff', // Black/White for dark/light mode
                  fontSize: '0.9rem',
                  padding: '5px 15px',
                  minWidth: '100px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <Avatar sx={{ bgcolor: 'transparent', marginRight: 1, width: 20, height: 20 }}>
                  🚪
                </Avatar>
                Home
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  color: isDarkMode ? '#fff' : '#000', // White/Black for dark/light mode
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  backgroundColor: isDarkMode ? '#000' : '#fff', // Black/White for dark/light mode
                  fontSize: '0.9rem',
                  padding: '5px 15px',
                  minWidth: '100px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <Avatar sx={{ bgcolor: 'transparent', marginRight: 1, width: 20, height: 20 }}>
                  🔍
                </Avatar>
                Discover
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  color: isDarkMode ? '#fff' : '#000', // White/Black for dark/light mode
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  backgroundColor: isDarkMode ? '#000' : '#fff', // Black/White for dark/light mode
                  fontSize: '0.9rem',
                  padding: '5px 15px',
                  minWidth: '100px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <Avatar sx={{ bgcolor: 'transparent', marginRight: 1, width: 20, height: 20 }}>
                  🏢
                </Avatar>
                About
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  color: isDarkMode ? '#fff' : '#000', // White/Black for dark/light mode
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  backgroundColor: isDarkMode ? '#000' : '#fff', // Black/White for dark/light mode
                  fontSize: '0.9rem',
                  padding: '5px 15px',
                  minWidth: '100px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <Avatar sx={{ bgcolor: 'transparent', marginRight: 1, width: 20, height: 20 }}>
                  🔑
                </Avatar>
                Sign In
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  color: isDarkMode ? '#fff' : '#000', // White/Black for dark/light mode
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  backgroundColor: isDarkMode ? '#000' : '#fff', // Black/White for dark/light mode
                  fontSize: '0.9rem',
                  padding: '5px 15px',
                  minWidth: '100px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
                  },
                }}
                onClick={toggleDarkMode}
              >
                <Avatar
                  sx={{
                    bgcolor: 'transparent',
                    marginRight: 1,
                    width: 24,
                    height: 24,
                    color: isDarkMode ? '#fff' : '#000', // White/Black for dark/light mode
                  }}
                >
                  {isDarkMode ? '🌙' : '☀️'}
                </Avatar>
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <div style={{flexGrow: 1, padding: '20px', overflowY: 'auto'}}> 
          <div className="main-content">
            <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold', marginTop: '5rem' }}>
              Brief Barrister
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom>
              Your Legal Companion
            </Typography>
            <div className="chat-container" ref={chatContainerRef} sx={{ marginBottom: '1rem', backgroundColor: 'transparent', display: 'flex', flexDirection: 'column' }}>
              {isSearchBarDisabled ? (
                <div>
                  {/* No search bar or icons */}
                </div>
              ) : (
                <div style={{ display: 'flex', marginBottom: '1rem', alignItems: 'center' }}>
                  <TextField
                    variant="outlined"
                    placeholder="Ask your query..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isSearchBarDisabled}
                    sx={{ 
                      mr: 1, 
                      flexGrow: 1, 
                      borderRadius: '50px', 
                      backgroundColor: theme.palette.background.paper, 
                      boxShadow: 2, 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '50px', 
                        '& fieldset': {
                          border: 'none', 
                        },
                        '&:hover fieldset': {
                          border: 'none', 
                        },
                        '&.Mui-focused fieldset': {
                          border: 'none', 
                        },
                        '&:focus': {
                          outline: 'none', 
                        },
                        color: theme.palette.text.primary, 
                        '& input::placeholder': { // Change placeholder color
                          color: isDarkMode ? 'white' : 'black', // Set to white in dark mode
                        },
                      },
                    }} 
                  />
                  <IconButton 
                    color="primary" 
                    onClick={handleSend} 
                    sx={{ 
                      borderRadius: '50%', 
                      backgroundColor: theme.palette.background.paper, 
                      '&:hover': {
                        backgroundColor: theme.palette.background.default, 
                      },
                      marginLeft: '5px' 
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                  <IconButton 
                    color="primary" 
                    onClick={handleMicClick} 
                    sx={{ 
                      borderRadius: '50%', 
                      backgroundColor: theme.palette.background.paper, 
                      '&:hover': {
                        backgroundColor: theme.palette.background.default, 
                      },
                      marginLeft: '5px' 
                    }}
                  >
                    <MicIcon />
                  </IconButton>
                </div>
              )}
              {isChatVisible && (
                <Paper elevation={3} sx={{ 
                  padding: 2, 
                  backgroundColor: theme.palette.background.paper, 
                  borderRadius: '20px', 
                  flexGrow: 1, 
                  marginBottom: '20px', 
                }}>
                  <List sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '100%',
                    overflowY: 'auto', 
                  }}>
                    {messages.map((message, index) => (
                      <ListItem key={index} sx={{ 
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-start', 
                      }}>
                        {message.sender === 'ai' && <AIAvatar theme={theme} />}
                        <Paper sx={{ 
                          padding: 2, 
                          borderRadius: 2, 
                          backgroundColor: message.sender === 'user' ? theme.palette.primary.main : theme.palette.background.paper, 
                          color: message.sender === 'user' ? 'white' : theme.palette.text.primary,
                          maxWidth: message.sender === 'ai' ? '90%' : '80%', 
                          wordBreak: 'break-word', 
                        }}>
                          {message.text}
                          {message.link && (
                            <Link href={message.link} target="_blank" sx={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                              {' '} [Read More]
                            </Link>
                          )}
                        </Paper>
                      </ListItem>
                    ))}
                    {isLoading && (
                      <ListItem>
                        <CircularProgress size={24} />
                      </ListItem>
                    )}
                    {/* Follow-Up Search Bar */}
                    {showFollowUp && (
                      <div style={{ display: 'flex', marginBottom: '1rem', alignItems: 'center' }}>
                        <TextField
                          variant="outlined"
                          placeholder="Ask follow-up question..."
                          inputRef={followUpInputRef}
                          onKeyPress={(e) => e.key === 'Enter' && handleFollowUpSubmit()}
                          sx={{ 
                            mr: 1, 
                            flexGrow: 1, 
                            borderRadius: '50px', 
                            backgroundColor: theme.palette.background.paper, 
                            boxShadow: 2, 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '50px', 
                              '& fieldset': {
                                border: 'none', 
                              },
                              '&:hover fieldset': {
                                border: 'none', 
                              },
                              '&.Mui-focused fieldset': {
                                border: 'none', 
                              },
                              '&:focus': {
                                outline: 'none', 
                              },
                              color: theme.palette.text.primary, 
                            },
                          }} 
                        />
                        <IconButton 
                          color="primary" 
                          onClick={handleFollowUpSubmit} 
                          sx={{ 
                            borderRadius: '50%', 
                            backgroundColor: theme.palette.background.paper, 
                            '&:hover': {
                              backgroundColor: theme.palette.background.default, 
                            },
                            marginLeft: '5px' 
                          }}
                        >
                          <SendIcon />
                        </IconButton>
                      </div>
                    )}
                  </List>
                  <div ref={messagesEndRef} />
                </Paper>
              )}
            </div>
            <div>
              <Button 
                variant="text" 
                onClick={() => setShowQuestions(!showQuestions)} 
                sx={{ 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  color: theme.palette.primary.main, 
                  fontSize: '0.8rem', 
                  padding: '0', 
                  textTransform: 'none', 
                  '&:hover': {
                    backgroundColor: 'transparent', 
                    color: theme.palette.secondary.main, 
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
                      color: theme.palette.primary.main, 
                      marginBottom: '1rem', 
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
                          padding: '10px', 
                          borderRadius: '8px', 
                          '&:hover': {
                            backgroundColor: theme.palette.background.default, 
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', 
                          },
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
                          color: theme.palette.primary.main, 
                          marginTop: '1rem', 
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
                              padding: '10px', 
                              borderRadius: '8px', 
                              '&:hover': {
                                backgroundColor: theme.palette.background.default, 
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', 
                              },
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
          onClose={() => setOpenDialog(false)}
          aria-labelledby="reference-dialog-title"
          aria-describedby="reference-dialog-description"
          maxWidth="md"
          fullWidth
          sx={{ 
            '& .MuiDialog-container': {
              '& .MuiPaper-root': {
                backgroundColor: theme.palette.background.paper, 
                borderRadius: '20px', 
                boxShadow: '5px 5px 20px rgba(0, 0, 0, 0.2)', 
              },
              '& .MuiDialogContent-root': {
                padding: '16px', 
                color: theme.palette.text.primary, 
              },
              '& .MuiDialogTitle-root': {
                padding: '5px 10px', 
                textAlign: 'center', 
                color: theme.palette.primary.main, 
              },
              '& .MuiDialogActions-root': {
                padding: '5px 10px', 
                justifyContent: 'center', 
              },
            },
            '& .MuiTypography-h6': {
              color: theme.palette.primary.main, 
              fontWeight: 'bold', 
            },
            '& .MuiButton-root': {
              padding: '8px 15px', 
              borderRadius: '20px', 
              fontSize: '0.7rem', 
              color: theme.palette.text.primary, 
              '&:hover': {
                backgroundColor: theme.palette.background.default, 
              },
            },
            '& .MuiDialogContent-root': {
              overflow: 'auto', 
            }
          }} 
        >
          <DialogTitle id="reference-dialog-title">
            {selectedContent?.title || "Article Details"}
          </DialogTitle>
          <DialogContent dividers>
            {selectedContent ? (
              <>
                <Typography variant="body1" paragraph>
                  {selectedContent.content}
                </Typography>
                {selectedContent.url && (
                  <Link 
                    href={selectedContent.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Source
                  </Link>
                )}
              </>
            ) : (
              <Typography variant="body1">Loading content...</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default LandingPage;