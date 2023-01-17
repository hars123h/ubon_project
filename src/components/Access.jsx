import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Switch from '@material-ui/core/Switch';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { Box, Button, TextField } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useState } from 'react';
import { useEffect } from 'react';
import { addDoc, collection, deleteDoc, getDoc, getDocs, doc } from 'firebase/firestore';
import db from '../firebase/config';
import { toast } from 'react-toastify'
import { Delete } from '@material-ui/icons';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

export default function Access() {
    const classes = useStyles();
    const theme = useTheme();
    const navigate = useNavigate();
    const [details, setDetails] = useState({
        name: '',
        email: '',
        password: '',
        access: 'Admin'
    })
    const [accessLevel, setAccessLevel] = useState('Admin');
    const [controllers, setControllers] = useState([]);
    const [open, setOpen] = React.useState(true);

    const getControllers = async () => {
        const data = await getDocs(collection(db, 'controllers'));
        var temp = [];
        var idx = 0;
        data.forEach((element) => {
            temp = [...temp, { ...element.data(), 'controller_id': data._snapshot.docChanges[idx].doc.key.path.segments[6] }]
            idx+=1;
        });
        setControllers(temp);
    }

    const handleDelete = async(id) => {
        const response  = await deleteDoc(doc(db, 'controllers', id))
        .then(()=>toast('User deleted successfully!'))
        .catch(()=>toast('Something went wrong!'));
        getControllers();
    }

    useEffect(() => {
        getControllers();
        if(localStorage.getItem('name')===null) {
            navigate('/admin/Login');
        }

    }, []);

    const handleSubmit = async () => {
        const dataAdded = await addDoc(collection(db, 'controllers'), details)
            .then(() => toast('User Added Successfully'))
            .catch(() => toast('Something went wrong'));
        setDetails({
            name: '',
            email: '',
            password: '',
            access: 'Admin'
        });
        getControllers();
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Acess
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: '1', justifyContent: 'end' }}>
                        <Typography variant="div" sx={{ fontSize: '10px' }}>Automatic</Typography>
                        <Switch />
                        <Typography variant='div' sx={{ fontSize: '10px' }}>Manual</Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <Typography>Thar Dashboard</Typography>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {['Dashboard', 'Withdrawals', 'Amount Setup', 'User', 'Transactions', 'Access', 'Feedback', 'Logout'].map((text, index) => (
                        <Link to={`/admin/${text}`}>
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        </Link>
                    ))}
                </List>

            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <Box className='flex flex-col gap-7 mx-auto w-2/5'>
                    <TextField label="Name*" variant='outlined' onChange={e => setDetails({ ...details, name: e.target.value })} />
                    <TextField label="Email Address*" variant='outlined' onChange={e => setDetails({ ...details, email: e.target.value })} />
                    <TextField label="Password*" variant='outlined' onChange={e => setDetails({ ...details, password: e.target.value })} />
                    <FormControl variant="filled" sx={{ m: 1 }}>
                        <InputLabel id="demo-simple-select-label">Access</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={accessLevel}
                            label="Access"
                            onChange={e => setDetails({ ...details, access: e.target.value })}
                        >
                            <MenuItem value={'Admin'}>Admin</MenuItem>
                            <MenuItem value={'Withdrawals'}>Withdrawals</MenuItem>
                            <MenuItem value={'Transactions'}>Transactions</MenuItem>
                        </Select>
                    </FormControl>
                    <div className='flex justify-center items-center'><Button onClick={handleSubmit} variant='contained' color="primary" className="w-2/5">Submit</Button></div>
                </Box>

                <Box className='mt-6'>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="left">Email</TableCell>
                                    <TableCell align="left">Access</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {controllers && controllers.map((row, index) => (
                                    <TableRow
                                        key={index+1}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="left">{row.email}</TableCell>
                                        <TableCell align="left">{row.access}</TableCell>
                                        <TableCell align='center'>
                                            <IconButton onClick={()=>handleDelete(row.controller_id)}><Delete color="error"/></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </main>
        </div>
    );
}
