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
import { Box } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Close } from '@material-ui/icons';
import { collection, getDocs, doc, updateDoc, increment, arrayUnion, query, orderBy } from 'firebase/firestore';
import db from '../firebase/config.js'
import { useEffect } from 'react';
import { useState } from 'react';
// import { RotatingLines } from 'react-loader-spinner';
import useInterval from '../hooks/useInterval.js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { useContext } from 'react';
import { AmountContext } from '../App.js';
import moment from 'moment';
import { RotatingLines } from 'react-loader-spinner';
import Status from './Status';



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

export default function Transactions() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const amountDetails = useContext(AmountContext);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('pending');

    const [recharge_list, setRecharge_list] = useState(null);
    const navigate = useNavigate();

    const getRecharges_list = async () => {
        const docRef = collection(db, 'recharges');
        const docSnap = await getDocs(query(docRef, orderBy('time', 'desc')));
        // console.log(docSnap);
        var temp_Data = [];
        var idx = 0;
        docSnap.forEach((doc) => {
            //console.log(doc.data(), 'this is the doc data');
            if (doc.data().status === value) {
            temp_Data = [...temp_Data, { ...doc.data(), 'recharge_id': docSnap._snapshot.docChanges[idx].doc.key.path.segments[6] }];
            }
            //console.log(temp_Data);
            idx += 1;
        });
        //_snapshot.docChanges[0].doc.key
        setRecharge_list(temp_Data);
    }

    // This is the rate at which the polling is done to update and get the new Data
    useInterval(getRecharges_list, 20000);

    useEffect(() => {
        if (localStorage.getItem('name') === null) {
            navigate('/admin/Login');
        }
        getRecharges_list();
    }, []);

    useEffect(()=>{
        getRecharges_list();
    },[value]);

    const updateStatus = async (recharge_id, new_status, recharge_value, user_id, element) => {
        const docRef = doc(db, 'recharges', recharge_id);
        const docRef2 = doc(db, 'users', user_id);
        //console.log(element);
        //console.log(user_id, parent_id, grand_parent_id);
        setLoading(true);
        await updateDoc(docRef, {
            status: new_status
        }).then(() => {
            //console.log('Recharge Status Approved', new_status);

            //console.log(element);
            //console.log('in This section');
            if (new_status === 'confirmed') {
                updateDoc(docRef2, {
                    recharge_amount: increment(recharge_value),
                    balance: increment(Number(recharge_value) + Number(amountDetails.recharge_bonus))
                });
                //(Number(amountDetails.level1_percent) / 100)
                updateDoc(doc(db, 'users', element.parent_id), {
                    balance: increment((Number(amountDetails.level1_percent) / 100) * Number(recharge_value)),
                    directRecharge: increment(Number(recharge_value)),
                    directMember: arrayUnion(user_id)
                });
                //(Number(amountDetails.level2_percent) / 100)
                updateDoc(doc(db, 'users', element.grand_parent_id), {
                    balance: increment((Number(amountDetails.level2_percent) / 100) * Number(recharge_value)),
                    indirectRecharge: increment(Number(recharge_value)),
                    indirectMember: arrayUnion(user_id)
                });
                //(Number(amountDetails.level3_percent) / 100)
                updateDoc(doc(db, 'users', element.great_grand_parent_id), {
                    balance: increment((Number(amountDetails.level3_percent) / 100) * Number(recharge_value)),
                    indirectRecharge: increment(Number(recharge_value)),
                    indirectMember: arrayUnion(user_id)
                });
                setLoading(false);
            }
            getRecharges_list();

        })
        .catch((error) => {
            console.log('Some Error Occured', error);
            setLoading(false);
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
                        Transactions
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
                    <Typography>Ubon Dashboard</Typography>
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

                <div className="table_details">
                    <Status value={value} setValue={setValue}/>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sr No.</TableCell>
                                    <TableCell align="right">Mobile Number</TableCell>
                                    <TableCell align="right">Reference Id</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recharge_list && recharge_list.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        {/*new Date(row.time.seconds*1000) */}
                                        <TableCell align="right">{row.mobno}</TableCell>
                                        <TableCell align="right">{row.refno}</TableCell>
                                        <TableCell align="right">Rs.{row.recharge_value}</TableCell>
                                        <TableCell align="right">{row.status}</TableCell>
                                        <TableCell align="right">{moment(new Date(row.time.seconds*1000)).fromNow()}</TableCell>
                                        {loading === true ? <TableCell align='center'>
                                            <RotatingLines 
                                            strokeColor="grey"
                                            strokeWidth="5"
                                            animationDuration="0.75"
                                            width="20" 
                                            />
                                        </TableCell> : <TableCell align="right">
                                            {row.status === 'pending' && (
                                                <Box>
                                                    <IconButton onClick={() => updateStatus(row.recharge_id, 'confirmed', row.recharge_value, row.user_id, row)}><Check /></IconButton>
                                                    <IconButton onClick={() => updateStatus(row.recharge_id, 'declined', row.recharge_value, row.user_id, row)}><Close /></IconButton>
                                                </Box>
                                            )}
                                        </TableCell>
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

            </main>
        </div>
    );
}
