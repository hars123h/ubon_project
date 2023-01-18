import React, {useState, useLayoutEffect} from 'react';
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
import { Box, TextField, Button } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import db from '../firebase/config.js';
import {updateDoc, getDoc,doc, collection} from 'firebase/firestore';
import {toast} from 'react-toastify';

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

export default function AmountSetup() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();
    const [amounts, setAmounts] = useState({
        amount:'',
        mwamount:'',
        invite_bonus:'',
        level1_percent:'',
        level2_percent:'',
        level3_percent:'',
        recharge_bonus:'',
        withdrawal_fee:'',
        upi_id:''
    });

    const getAmountValues = async() => {
        const details = await getDoc(doc(db, 'amounts', 'wgx5GRblXXwhlmx4XYok'))
        if(details.exists()) {
            setAmounts(details.data());
            //console.log(details.data());
        }else {
            toast('Not able to fetch Amounts!');
        }
    }

    useLayoutEffect(()=>{
        if(localStorage.getItem('name')===null) {
            navigate('/admin/Login');
        }
        getAmountValues();
    },[]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleSetValues = async() => {
        //wgx5GRblXXwhlmx4XYok
        const response = await updateDoc(doc(db, 'amounts', 'wgx5GRblXXwhlmx4XYok'), amounts)
        .then((response)=>toast('Amounts updated successfully!'))
        .catch(error=>toast('Something went wrong!'));
    }

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
                        Amount Setup
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

                <Box sx={{ display: 'grid', gridTemplateColumns:"repeat(2, 50%)", gap: "10px" }}>
                    <TextField required
                        label="Amount [in Rs.]"
                        placeholder={amounts.amount}
                        sx={{ width: "50%"}}
                        variant="outlined"
                        defaultValue={amounts.amount}
                        onChange={e=>setAmounts({...amounts, amount:Number(e.target.value)})}
                        type="number"
                    />

                    <TextField required
                        label="Minimum withdrawal amount [in Rs.]"
                        defaultValue={amounts.mwamount}
                        placeholder={amounts.mwamount}
                        sx={{ width: "50%" }}
                        variant="outlined"
                        onChange={e=>setAmounts({...amounts, mwamount:Number(e.target.value)})}
                        type="number"
                    />

                    <TextField required
                        label="Invite bonus amount [in Rs.]"
                        defaultValue={amounts.invite_bonus}
                        placeholder={amounts.invite_bonus}
                        sx={{ width: "50%" }}
                        variant="outlined"
                        onChange={e=>setAmounts({...amounts, invite_bonus:Number(e.target.value)})}
                        type="number"
                    />

                    <TextField required
                        label="Level 1 commission percent [in %]"
                        defaultValue={amounts.level1_percent}
                        placeholder={amounts.level1_percent}
                        sx={{ width: "50%" }}
                        variant="outlined"
                        onChange={e=>setAmounts({...amounts, level1_percent:Number(e.target.value)})}
                        type="number"
                    />

                    <TextField required
                        label="Level 2 commission percent [in %]"
                        defaultValue={amounts.level2_percent}
                        placeholder={amounts.level2_percent}
                        sx={{ width: "50%" }}
                        variant="outlined"
                        onChange={e=>setAmounts({...amounts, level2_percent:Number(e.target.value)})}
                        type="number"
                    />

                    <TextField required
                        label="Level 3 commission percent [in %]"
                        defaultValue={amounts.level3_percent}
                        placeholder={amounts.level3_percent}
                        sx={{ width: "50%" }}
                        variant="outlined"
                        onChange={e=>setAmounts({...amounts, level3_percent:Number(e.target.value)})}
                        type="number"
                    />

                    <TextField required
                        label="Recharge bonus [in %]"
                        defaultValue={amounts.recharge_bonus}
                        placeholder={amounts.recharge_bonus}
                        sx={{ width: "50%" }}
                        variant="outlined"
                        helperText="[0.01 == 1%], [0.02 == 2%], [0.03 == 3%], ... [0.10 == 10%]"
                        onChange={e=>setAmounts({...amounts, recharge_bonus:Number(e.target.value)})}
                        type="number"
                    />

                    <TextField required
                        label="Withdrawal Fee [in %]"
                        defaultValue={amounts.withdrawal_fee}
                        placeholder={amounts.withdrawal_fee}
                        sx={{ width: "50%" }}
                        variant="outlined"
                        helperText="[0.01 == 1%], [0.02 == 2%], [0.03 == 3%]"
                        onChange={e=>setAmounts({...amounts, withdrawal_fee:Number(e.target.value)})}
                        type="number"
                    />

                    <TextField required
                        label="UPI"
                        defaultValue={amounts.upi_id}
                        placeholder={amounts.upi_id}
                        sx={{ width: "50%" }}
                        variant="outlined"
                        helperText="username@ybl,etc"
                        onChange={e=>setAmounts({...amounts, upi_id:e.target.value})}
                    />
                </Box>

                <Box className='mt-4 flex justify-end'>
                    <Button variant='contained' color="primary" onClick={handleSetValues}>Submit</Button>
                </Box>

            </main>
        </div>
    );
}
