import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { checkAUTH } from "../helper/helperFN";
import { history } from "../index";

const API_URL = process.env.REACT_APP_API_URL;

// Helper function to get authentication headers
const getAuthHeaders = () => {
    let accessToken = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Accept-Language": "en",
        },
    };
};

export const fetchQuestions = createAsyncThunk(
    'questions/fetchQuestions',
    async (_, { rejectWithValue }) => {
        if (checkAUTH()) {
            try {
                const response = await axios.post(
                    `${API_URL}/getAdminQuesList`,
                    {},
                    getAuthHeaders()
                );
                return response.data;
            } catch (error) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
        } else {
            history.push("/");
            window.location.reload();
            return null;
        }
    }
);

export const saveQuestion = createAsyncThunk(
    'questions/saveQuestion',
    async (questionData, { rejectWithValue }) => {
        if (checkAUTH()) {
            try {
                const response = await axios.post(
                    `${API_URL}/saveMainQuestions`,
                    questionData,
                    getAuthHeaders()
                );
                
                if (response.data.errors) {
                    return rejectWithValue(response.data.errors);
                }
                
                return { ...questionData, ques_id: response.data.idOut };
            } catch (error) {
                const errorMessage = error.response?.data?.errors || 
                                   error.response?.data?.message || 
                                   error.message;
                return rejectWithValue(errorMessage);
            }
        } else {
            history.push("/");
            window.location.reload();
            return null;
        }
    }
);

export const saveQuestionTranslation = createAsyncThunk(
    'questions/saveQuestionTranslation',
    async (translationData, { rejectWithValue }) => {
        if (checkAUTH()) {
            try {
                const response = await axios.post(
                    `${API_URL}/saveQuestionsTranslation`,
                    translationData,
                    getAuthHeaders()
                );
                
                if (response.data.errors) {
                    return rejectWithValue(response.data.errors);
                }
                
                return { ...translationData, id: response.data.idOut };
            } catch (error) {
                const errorMessage = error.response?.data?.errors || 
                                   error.response?.data?.message || 
                                   error.message;
                return rejectWithValue(errorMessage);
            }
        } else {
            history.push("/");
            window.location.reload();
            return null;
        }
    }
);

const questionsSlice = createSlice({
    name: 'questions',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        currentQuestion: null,
        saveStatus: 'idle',
        saveError: null,
        translationStatus: 'idle',
        translationError: null
    },
    reducers: {
        setCurrentQuestion: (state, action) => {
            state.currentQuestion = action.payload;
        },
        clearCurrentQuestion: (state) => {
            state.currentQuestion = null;
        },
        resetSaveStatus: (state) => {
            state.saveStatus = 'idle';
            state.saveError = null;
        },
        resetTranslationStatus: (state) => {
            state.translationStatus = 'idle';
            state.translationError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Questions
            .addCase(fetchQuestions.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            
            // Save Question
            .addCase(saveQuestion.pending, (state) => {
                state.saveStatus = 'loading';
                state.saveError = null;
            })
            .addCase(saveQuestion.fulfilled, (state, action) => {
                state.saveStatus = 'succeeded';
                const existingIndex = state.items.findIndex(q => q.ques_id === action.payload.ques_id);
                if (existingIndex >= 0) {
                    state.items[existingIndex] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
                state.currentQuestion = action.payload;
            })
            .addCase(saveQuestion.rejected, (state, action) => {
                state.saveStatus = 'failed';
                state.saveError = action.payload || action.error.message;
            })
            
            // Save Translation
            .addCase(saveQuestionTranslation.pending, (state) => {
                state.translationStatus = 'loading';
                state.translationError = null;
            })
            .addCase(saveQuestionTranslation.fulfilled, (state, action) => {
                state.translationStatus = 'succeeded';
                if (state.currentQuestion) {
                    const translationIndex = state.currentQuestion.questions?.findIndex(
                        t => t.id === action.payload.id
                    );
                    
                    if (action.payload.delete) {
                        // Remove deleted translation
                        state.currentQuestion.questions = state.currentQuestion.questions?.filter(
                            t => t.id !== action.payload.id
                        );
                    } else if (translationIndex >= 0) {
                        // Update existing translation
                        state.currentQuestion.questions[translationIndex] = action.payload;
                    } else {
                        // Add new translation
                        state.currentQuestion.questions = [
                            ...(state.currentQuestion.questions || []),
                            action.payload
                        ];
                    }
                }
            })
            .addCase(saveQuestionTranslation.rejected, (state, action) => {
                state.translationStatus = 'failed';
                state.translationError = action.payload || action.error.message;
            });
    }
});

export const { 
    setCurrentQuestion, 
    clearCurrentQuestion,
    resetSaveStatus,
    resetTranslationStatus
} = questionsSlice.actions;

export default questionsSlice.reducer;