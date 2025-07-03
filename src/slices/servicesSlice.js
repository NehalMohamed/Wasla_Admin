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

export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async (_, { rejectWithValue }) => {
        if (checkAUTH()) {
            try {
                const response = await axios.post(
                    `${API_URL}/getMainServices`,
                    { isDropDown: false },
                    getAuthHeaders()
                );
                return response.data;
            } catch (error) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
        } else {
            // Redirect to login if not authenticated
            history.push("/");
            window.location.reload();
            return null;
        }
    }
);

export const saveService = createAsyncThunk(
    'services/saveService',
    async (serviceData, { rejectWithValue }) => {
        if (checkAUTH()) {
            try {
                const response = await axios.post(
                    `${API_URL}/SaveMainServices`,
                    serviceData,
                    getAuthHeaders()
                );
                
                // Check if the API returned an error message
                if (response.data.errors) {
                    return rejectWithValue(response.data.errors);
                }
                
                return { ...serviceData, id: response.data.idOut };
            } catch (error) {
                // Handle both API errors and network errors
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

export const saveTranslation = createAsyncThunk(
    'services/saveTranslation',
    async (translationData, { rejectWithValue }) => {
        if (checkAUTH()) {
            try {
                const response = await axios.post(
                    `${API_URL}/SaveServicesTranslations`,
                    translationData,
                    getAuthHeaders()
                );
                
                // Check if the API returned an error message
                if (response.data.errors) {
                    return rejectWithValue(response.data.errors);
                }
                
                return { ...translationData, id: response.data.idOut };
            } catch (error) {
                // Handle both API errors and network errors
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

const servicesSlice = createSlice({
    name: 'services',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        currentService: null,
        saveStatus: 'idle',
        saveError: null,
        translationStatus: 'idle',
        translationError: null
    },
    reducers: {
        setCurrentService: (state, action) => {
            state.currentService = action.payload;
        },
        clearCurrentService: (state) => {
            state.currentService = null;
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
            // Fetch Services
            .addCase(fetchServices.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            
            // Save Service
            .addCase(saveService.pending, (state) => {
                state.saveStatus = 'loading';
                state.saveError = null;
            })
            .addCase(saveService.fulfilled, (state, action) => {
                state.saveStatus = 'succeeded';
                const existingIndex = state.items.findIndex(s => s.id === action.payload.id);
                if (existingIndex >= 0) {
                    state.items[existingIndex] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
                state.currentService = action.payload;
            })
            .addCase(saveService.rejected, (state, action) => {
                state.saveStatus = 'failed';
                state.saveError = action.payload || action.error.message;
            })
            
            // Save Translation
            .addCase(saveTranslation.pending, (state) => {
                state.translationStatus = 'loading';
                state.translationError = null;
            })
            .addCase(saveTranslation.fulfilled, (state, action) => {
                state.translationStatus = 'succeeded';
                if (state.currentService) {
                    const translationIndex = state.currentService.service_translations?.findIndex(
                        t => t.id === action.payload.id
                    );
                    
                    if (action.payload.delete) {
                        // Remove deleted translation
                        state.currentService.service_translations = state.currentService.service_translations?.filter(
                            t => t.id !== action.payload.id
                        );
                    } else if (translationIndex >= 0) {
                        // Update existing translation
                        state.currentService.service_translations[translationIndex] = action.payload;
                    } else {
                        // Add new translation
                        state.currentService.service_translations = [
                            ...(state.currentService.service_translations || []),
                            action.payload
                        ];
                    }
                }
            })
            .addCase(saveTranslation.rejected, (state, action) => {
                state.translationStatus = 'failed';
                state.translationError = action.payload || action.error.message;
            });
    }
});

export const { 
    setCurrentService, 
    clearCurrentService,
    resetSaveStatus,
    resetTranslationStatus
} = servicesSlice.actions;

export default servicesSlice.reducer;