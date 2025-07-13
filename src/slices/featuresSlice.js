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

export const fetchFeatures = createAsyncThunk(
    'features/fetchFeatures',
    async (_, { rejectWithValue }) => {
        if (checkAUTH()) {
            try {
                const response = await axios.post(
                    `${API_URL}/getFeaturesWithTranslations`,
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

export const saveFeature = createAsyncThunk(
    'features/saveFeature',
    async (featureData, { rejectWithValue }) => {
        if (checkAUTH()) {
            try {
                const response = await axios.post(
                    `${API_URL}/SaveMainFeature`,
                    featureData,
                    getAuthHeaders()
                );
                
                if (response.data.errors) {
                    return rejectWithValue(response.data.errors);
                }
                
                return { ...featureData, id: response.data.idOut };
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

export const saveFeatureTranslation = createAsyncThunk(
    'features/saveFeatureTranslation',
    async (translationData, { rejectWithValue }) => {
        if (checkAUTH()) {
            try {
                const response = await axios.post(
                    `${API_URL}/SaveFeatureTranslations`,
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

const featuresSlice = createSlice({
    name: 'features',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        currentFeature: null,
        saveStatus: 'idle',
        saveError: null,
        translationStatus: 'idle',
        translationError: null
    },
    reducers: {
        setCurrentFeature: (state, action) => {
            state.currentFeature = action.payload;
        },
        clearCurrentFeature: (state) => {
            state.currentFeature = null;
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
            // Fetch Features
            .addCase(fetchFeatures.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchFeatures.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchFeatures.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            
            // Save Feature
            .addCase(saveFeature.pending, (state) => {
                state.saveStatus = 'loading';
                state.saveError = null;
            })
            .addCase(saveFeature.fulfilled, (state, action) => {
                state.saveStatus = 'succeeded';
                const existingIndex = state.items.findIndex(f => f.feature_id === action.payload.id);
                if (existingIndex >= 0) {
                    state.items[existingIndex] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
                state.currentFeature = action.payload;
            })
            .addCase(saveFeature.rejected, (state, action) => {
                state.saveStatus = 'failed';
                state.saveError = action.payload || action.error.message;
            })
            
            // Save Translation
            .addCase(saveFeatureTranslation.pending, (state) => {
                state.translationStatus = 'loading';
                state.translationError = null;
            })
            .addCase(saveFeatureTranslation.fulfilled, (state, action) => {
                state.translationStatus = 'succeeded';
                if (state.currentFeature) {
                    const translationIndex = state.currentFeature.features_Translations?.findIndex(
                        t => t.id === action.payload.id
                    );
                    
                    if (action.payload.delete) {
                        // Remove deleted translation
                        state.currentFeature.features_Translations = state.currentFeature.features_Translations?.filter(
                            t => t.id !== action.payload.id
                        );
                    } else if (translationIndex >= 0) {
                        // Update existing translation
                        state.currentFeature.features_Translations[translationIndex] = action.payload;
                    } else {
                        // Add new translation
                        state.currentFeature.features_Translations = [
                            ...(state.currentFeature.features_Translations || []),
                            action.payload
                        ];
                    }
                }
            })
            .addCase(saveFeatureTranslation.rejected, (state, action) => {
                state.translationStatus = 'failed';
                state.translationError = action.payload || action.error.message;
            });
    }
});

export const { 
    setCurrentFeature, 
    clearCurrentFeature,
    resetSaveStatus,
    resetTranslationStatus
} = featuresSlice.actions;

export default featuresSlice.reducer;