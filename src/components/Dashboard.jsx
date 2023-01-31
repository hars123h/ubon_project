import React, { useState } from 'react';
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
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AmountContext } from '../App.js';
import axios from 'axios';
import BASE_URL from '../api_url.js';

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

export default function Dashboard() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();
    const amountDetails = useContext(AmountContext);
    const [adminData, setAdminData] = useState([]);
    const [recSum, setRecSum] = useState(0);
    const [witSum, setWitSum] = useState(0);
    const [balSum, setBalSum] = useState(0);


    useEffect(() => {
        if (localStorage.getItem('name') === null) {
            navigate('/admin/Login');
        }
        
        const get_sum_data = async() => {
            await axios.get(`${BASE_URL}/dashboard_data_sum`).then(response=>{
                setRecSum(response.data.totalRecharge);
                setWitSum(response.data.totalWithdrawal);
                setBalSum(response.data.totalBalance);
            })
        }
        getData();
        get_sum_data();

    }, []);

    const getData = async () => {
        const dataRes = await axios.get(`${BASE_URL}/amounts`).then(({data})=>{
            // console.log(res);
            setAdminData(data.data.plan_state);
        });
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
                        Dashboard
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
                    <Typography>RTR Dashboard</Typography>
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

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <Box sx={{ backgroundColor: '#e5e7eb', padding: "20px", borderRadius: '5px', display: 'inline', width: '24%' }} className="shadow-lg">
                        <Box >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-14">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </Box>
                        <Typography >Total Users Count</Typography>
                        <Typography>{amountDetails.userCount}</Typography>
                    </Box>

                    <Box sx={{ backgroundColor: '#e5e7eb', padding: "20px", borderRadius: '5px', display: 'inline', width: '24%' }} className="shadow-lg">
                        <Typography variant="h3">&#8377;</Typography>
                        <Typography >Total Recharge Amount</Typography>
                        <Typography>&#8377; {recSum}</Typography>
                    </Box>

                    <Box sx={{ backgroundColor: '#e5e7eb', padding: "20px", borderRadius: '5px', display: 'inline', width: '24%' }} className="shadow-lg">
                        <Typography variant="h3">&#8377;</Typography>
                        <Typography >Total Withdrawal Amount</Typography>
                        <Typography>&#8377; {witSum}</Typography>
                    </Box>

                    <Box sx={{backgroundColor: '#e5e7eb', padding: "20px", borderRadius: '5px', display: 'inline', width: '24%' }} className="shadow-lg">
                        <Typography variant="h3">&#8377;</Typography>
                        <Typography >Total Balance Sum</Typography>
                        <Typography  >&#8377; {balSum}</Typography>
                    </Box>
                </Box>

                <Box sx={{ m: 2, p: 2 }} className="rounded-md shadow-xl border border-gray-200">
                    <TableContainer>
                        <Table size="small" >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Plan Name</TableCell>
                                    <TableCell>Plan Type</TableCell>
                                    <TableCell>Visibility</TableCell>
                                    <TableCell align="center">Change Visibility</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {adminData && adminData.map((element, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>RTR Plan {index + 1}</TableCell>
                                            <TableCell>{(index + 1) <= 6 ? 'Normal' : 'VIP'}</TableCell>
                                            <TableCell>{element === 1 ? 'Yes' : 'No'}</TableCell>
                                            <TableCell align="center">
                                                <Button color="primary" size='small' variant='contained'
                                                    onClick={async () => {
                                                        var temp = adminData;
                                                        temp[index] = 1 - element;
                                                        await axios.post(`${BASE_URL}/update_plan_state`, {
                                                            new_plan_state: temp
                                                        }).then(() => getData());
                                                    }}>Toggle Visibility</Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Box>
            </main>
        </div>
    );
}
