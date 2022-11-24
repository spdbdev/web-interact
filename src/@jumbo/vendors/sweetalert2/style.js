// A style sheet
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(theme => ({
    container: {
      zIndex: 1200,
    },
    popup: {
        width: '24em',
        overflow: 'hidden',
        borderRadius: 23,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: '400',
        color: theme.typography.h1.color
    },
    closeButton: {
        color: theme.palette.text.primary,

        '&:focus': {
            boxShadow: 'none',
        },
        '&:hover': {
            color: theme.typography.h1.color
        }
    },
    image: {
      margin: theme.spacing(0, 'auto', 2),
    },
    htmlContainer: {
        fontSize: '1rem',
        lineHeight: 1.5,
        margin: theme.spacing(1, 3, .5),

        '& a': {
            textDecoration: 'none',
            color: theme.palette.primary.main,
        }
    },
    confirmButton: {
        border: 0,
        margin: '.521125em',
        cursor: 'pointer',
        color: theme.palette.common.white,
        boxSizing: 'border-box',
        fontSize: '0.875rem',
        lineHeight: 1.75,
        padding: theme.spacing(.75, 2),
        borderRadius: "8.69px 2.69px",
        fontFamily: 'inherit',
        background: "linear-gradient(180deg, #782FEE -8.69%, #DD00FF 109.93%)",
        //borderColor: "primary.main",
        fontWeight: 600,
        px: 4,
        py: 1,

        '&:hover': {
            background:
              "linear-gradient(90deg, #782FEE -8.69%, #DD00FF 109.93%)", // theme.palette.primary.main
            //color: "white",
        }
          
    },
    cancelButton: {
        borderRadius: "2.69px 7.9px",
        margin: '.3125em',
        cursor: 'pointer',
        color: theme.palette.common.white,
        boxSizing: 'border-box',
        fontSize: '0.875rem',
        lineHeight: 1.75,
        padding: theme.spacing(.75, 2),
        border: 0,
        fontFamily: 'inherit',
        backgroundColor: theme.palette.grey[600],

        '&:hover, &:focus, &:active': {
            backgroundColor: theme.palette.grey[700],
        }
    },
    footer: {
        marginTop: '1.5rem',
        fontSize: '.875rem',
        borderColor: theme.palette.divider,
        '& a': {
            textDecoration: 'none',
            color: theme.palette.primary.main,
        }
    }
}));

export default useStyles;
