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
import { Box, InputAdornment, TextField, Tab, Tabs, Select, MenuItem } from '@material-ui/core';
import { Search, Visibility, Block, Edit } from '@material-ui/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { collection, getDocs, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import db from '../firebase/config.js'
import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';
import { useState } from 'react';
import DateDifference from '../utility/DateDifference.js';
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

export default function User() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = React.useState(0);
    const [recharges, setRecharges] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [refer1, setRefer1] = useState([]);
    const [refer2, setRefer2] = useState([]);
    const [plans, setPlans] = useState([]);

    const [CurrentLevel, setCurrentLevel] = useState('level1');

    useEffect(() => {
        if (localStorage.getItem('name') === null) {
            navigate('/admin/Login');
        }
        getRecharges();
        getWithdrawals();
        getReferDetails();
        getPlans();
    }, []);

    const getPlans = async() => {
        await axios.post(`${BASE_URL}/get_user` ,{ user_id:location.state.user_id }).then(({data})=>data)
            .then((response) => {
                var temp = [];
                response.plans_purchased.forEach(async (element) => {
                    temp = [...temp, element];
                    setPlans(temp);
                });
                console.log(temp);
            })
            .catch(error => console.log(error));
    }

    const getReferDetails = () => {
        var temp1 = [];
        var temp2 = [];

        location.state.directMember.map(async (id) => {
            const dataTemp = await axios.post(`${BASE_URL}/get_user` ,{ user_id:id }).then(({data})=>data)
            if (dataTemp) {
                temp1.push(dataTemp);
            }

        });
        setRefer1(temp1);

        location.state.indirectMember.map(async (id) => {
            const dataTemp = await axios.post(`${BASE_URL}/get_user` ,{ user_id:id }).then(({data})=>data)
            if (dataTemp) {
                temp2.push(dataTemp);
            }
        });

        setRefer2(temp2);
    }

    const getWithdrawals = async () => {
        const withdrawal1 = await axios.post(`${BASE_URL}/get_user_withdrawals`, {user_id:location.state.user_id}).then(({data})=>data)
            .then((response) => {
                
                    setWithdrawals(response);
                })       
            .catch(error => console.log(error));
    }

    const getRecharges = async () => {
        const recharge1 = await axios.post(`${BASE_URL}/get_user_recharges`, {user_id:location.state.user_id}).then(({data})=>data)
            .then((response) => {
                
                    setRecharges(response);
                })       
            .catch(error => console.log(error));
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
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
                        {location.state.mobno}
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

                <Typography variant='h4'>Refer Code: {location.state.user_invite}</Typography>

                <Box sx={{ width: '100%', mt: 3 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Recharge" {...a11yProps(0)} />
                            <Tab label="Withdrawals" {...a11yProps(1)} />
                            <Tab label="Refer History" {...a11yProps(2)} />
                            <Tab label="Plans Purchased" {...a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>

                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Mobile Number</TableCell>
                                    <TableCell>Reference Id</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    recharges && recharges.map((element) => {
                                        return (
                                            <TableRow>
                                                <TableCell>{location.state.bankDetails?.fullName ? location.state.bankDetails.fullName : 'Not Given'}</TableCell>
                                                <TableCell>{element.mobno}</TableCell>
                                                <TableCell>{element.refno}</TableCell>
                                                <TableCell><span className='font-bold'>{String(element.status).toUpperCase()}</span></TableCell>
                                                <TableCell>&#8377;{element.recharge_value}</TableCell>
                                                <TableCell>{new Date(element.time.seconds * 1000).toDateString()}</TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Account no</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Bank Name</TableCell>
                                    <TableCell>IFSC Code</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    withdrawals.map((element) => {
                                        return (
                                            <TableRow>
                                                <TableCell>{element.bankAccount}</TableCell>
                                                <TableCell>{element.fullName}</TableCell>
                                                <TableCell>{element.bankName}</TableCell>
                                                <TableCell>{element.ifsc}</TableCell>
                                                <TableCell><span className='font-bold'>{String(element.status).toUpperCase()}</span></TableCell>
                                                <TableCell>&#8377; {element.withdrawalAmount}</TableCell>
                                                <TableCell>{new Date(element.time.seconds * 1000).toDateString()}</TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Select variant='outlined' onChange={e => setCurrentLevel(e.target.value)} value={CurrentLevel} label="Refer Level">
                            <MenuItem value={"level1"}>Level 1</MenuItem>
                            <MenuItem value={"level2"}>Level 2</MenuItem>
                        </Select>
                        {CurrentLevel === 'level1' && <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Phone Number</TableCell>
                                    <TableCell>Reward</TableCell>
                                    <TableCell>Level</TableCell>
                                    <TableCell>Total Recharge</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    refer1.map((element) => {
                                        return (
                                            <TableRow key={element.user_id}>
                                                <TableCell>{element.mobno}</TableCell>
                                                <TableCell>&#8377;{Number(element.directRecharge) + Number(element.indirectRecharge)}</TableCell>
                                                <TableCell>Level 1</TableCell>
                                                <TableCell>&#8377;{element.recharge_amount}</TableCell>
                                                <TableCell>{new Date(element.time.seconds * 1000).toDateString()}</TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>}

                        {CurrentLevel === 'level2' && <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Phone Number</TableCell>
                                    <TableCell>Reward</TableCell>
                                    <TableCell>Level</TableCell>
                                    <TableCell>Total Recharge</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    refer2.map((element) => {
                                        return (
                                            <TableRow key={element.user_id}>
                                                <TableCell>{element.mobno}</TableCell>
                                                <TableCell>&#8377;{Number(element.directRecharge) + Number(element.indirectRecharge)}</TableCell>
                                                <TableCell>Level 2</TableCell>
                                                <TableCell>&#8377;{element.recharge_amount}</TableCell>
                                                <TableCell>{new Date(element.time.seconds * 1000).toDateString()}</TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>}
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Plan Name</TableCell>
                                    <TableCell>Plan Type</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Plan Amount (in &#8377;)</TableCell>
                                    <TableCell>Plan Cycle</TableCell>
                                    <TableCell>Plan Daily Earning (in &#8377;)</TableCell>
                                    <TableCell>Current Earning (in &#8377;)</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    plans && plans.map((element) => {
                                        return (
                                            <TableRow>
                                                <TableCell>{element.plan_name}</TableCell>
                                                <TableCell>{element.plan_type}</TableCell>
                                                <TableCell>{element.date_purchased}</TableCell>
                                                <TableCell>{element.quantity}</TableCell>
                                                <TableCell>&#8377;{element.plan_amount}</TableCell>
                                                <TableCell>{element.plan_cycle}</TableCell>
                                                <TableCell>&#8377;{element.plan_daily_earning}</TableCell>
                                                <TableCell>&#8377;{DateDifference(new Date(element.date_purchased), new Date(element.date_till_rewarded)) * element.quantity * element.plan_daily_earning}</TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TabPanel>
                </Box>

            </main>
        </div>
    );
}
