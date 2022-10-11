import { useState } from 'react'

export default function InteractButton({onClick, title}) {

    return (
        <div onClick={onClick} style={{
            padding:5, paddingLeft:10, paddingRight:10, color:'#782fee', fontWeight:'bold', display: 'inline-block', cursor:'pointer',
            border:'2px solid #782fee', borderBottomLeftRadius:11, borderTopRightRadius:11, 
        }}>
            {title}
        </div>
    )
}
