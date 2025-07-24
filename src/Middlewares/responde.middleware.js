export const ErrResponder = (error,res) =>{

     res.status(500).json({
        success: false,
        message: "Internal server error",
        error: {
            name: error.name,       
            message: error.message, 
            details: error.errors  
        }
    })
    return res
} 






