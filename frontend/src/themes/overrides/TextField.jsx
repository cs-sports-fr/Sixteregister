export default function TextField() {
    return {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#093274', // Hover color
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#093274', // Focused color
                        borderWidth: '2px', // Thicker border on focus
                    },
                    height: '2.5rem',
                    
                    '.MuiInputBase-input': {
                        padding: '14px 16px',
                        fontSize: '16px',
                        color: 'black', // Ensures the text color is black
                    },
                },
            },
        },
    };
}
