import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface Args {
    baseCode: string;
    targetCode: string;
}

export function useConvert({
    baseCode, targetCode
}: Args) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [conversionRate, setConversionRate] = useState<number>(0);

    const getConversionRate = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const baseUrl = import.meta.env.VITE_BASE_URL;
            const apiKey = import.meta.env.VITE_API_KEY;
            
            if (!baseUrl || !apiKey) {
                throw new Error('API configuration is missing. Please check your environment variables.');
            }
            
            if (!baseCode || !targetCode) {
                throw new Error('Base or target currency code is missing.');
            }
            
            console.log(`Fetching conversion rate from ${baseCode} to ${targetCode}...`);
            
            const res = await axios.get(`${baseUrl}/${apiKey}/pair/${baseCode}/${targetCode}`, {
                timeout: 10000,
            });
            
            if (res.status !== 200) {
                throw new Error(`API request failed with status: ${res.status}`);
            }
            
            const data = res.data;
            
            if (data.result === 'error') {
                throw new Error(`API error: ${data['error-type'] || 'Unknown API error'}`);
            }
            
            if (data && typeof data.conversion_rate === 'number') {
                setConversionRate(data.conversion_rate);
                console.log(`Conversion rate from ${baseCode} to ${targetCode}: ${data.conversion_rate}`);
            } else {
                console.error('Invalid API response:', data);
                throw new Error('Invalid API response: conversion_rate not found or not a number');
            }
        } catch (error: unknown) {
            console.error('Conversion error:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    setError('Request timeout. Please try again later.');
                } else if (!error.response) {
                    setError('Network error. Please check your internet connection.');
                } else {
                    setError(`API error: ${error.response.status} - ${error.message}`);
                }
            } else {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                setError(errorMessage);
            }
            
            setConversionRate(0);
        } finally {
            setIsLoading(false); 
        }
    }, [baseCode, targetCode]);
    

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        getConversionRate();
    }, [getConversionRate]);

    return {
        conversionRate,
        isLoading,
        error,
        clearError
    };
}