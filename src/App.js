//Ben Luo: Project 2

//Imports
import React from 'react';
import './style.css';
import React, { Component, useState } from 'react';
import CardHeader from '@mui/material/CardHeader';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import moment from 'moment';
import TextField from '@mui/material/TextField';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import CancelIcon from '@mui/icons-material/Cancel';
import RadioGroup from '@mui/material/RadioGroup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//App to make a table of todos/tasks/entries
export default function App() {
  //toastrs
  const deleteSuccess = () => toast.success('Task successfully deleted');
  const addSuccess = () => toast.success('Task successfully added');
  const updateSuccess = () => toast.success('Task successfully updated');

  //Array of entries
  const [arrayEntry, setArrayEntry] = useState([]);

  //Attributes of each entry
  const [entry, setEntry] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: '',
    complete: false,
  });

  //store index inorder to update the correct task
  const [storeIndex, setStoreIndex] = useState(-1);

  //Validation for title and description
  //string error messages
  const [titleValidator, setTitleValidator] = useState('');
  const [descriptionValidator, setDescriptionValidator] = useState('');
  //error flags
  const [titleError, setTitleError] = useState(false);
  const [descError, setDescError] = useState(false);

  //Modify dialog for editing
  //We're either in adding state or Not adding state(Editing state)
  const [addingState, setAddingState] = useState(true);

  //Dialog
  const [displayDialog, setDisplayDialog] = React.useState(false);

  //adding and validating dialog
  let changeTitle = (value) => {
    setEntry({ ...entry, title: value.target.value });
  };

  let changeDescription = (value) => {
    setEntry({ ...entry, description: value.target.value });
  };

  //General Display Dialog
  const openDialog = () => {
    setDisplayDialog(true);
  };
  //Closes dialog and clears errors
  const closeDialog = () => {
    setDisplayDialog(false);
    setTitleValidator('');
    setDescriptionValidator('');
    setTitleError(false);
    setDescError(false);
  };

  //openDialog from add button
  const openAddingDialog = () => {
    reset();
    setAddingState(true);
    openDialog();
  };

  //validate title and return true if a problem exists
  let validateTitle = () => {
    let titleToCheck = entry.title;
    let problem = false;

    //check for duplicates
    for (let i = 0; i < arrayEntry.length; i++) {
      if (titleToCheck === arrayEntry[i].title) {
        setTitleValidator('Unique Title is required!');
        problem = true;
        setTitleError(true);
        return problem;
      }
    }

    //check empty
    if (titleToCheck == '') {
      setTitleValidator('Title is required!');
      problem = true;
      setTitleError(true);
    } else {
      setTitleError(false);
      setTitleValidator('');
    }
    return problem;
  };

  //validate description to make sure its not empty
  let validateDescription = () => {
    let descToCheck = entry.description;
    let problem = false;

    if (descToCheck == '') {
      setDescriptionValidator('Description is required!');
      problem = true;
      setDescError(true);
    } else {
      setDescError(false);
      setDescriptionValidator('');
    }

    return problem;
  };

  //if no error, then add, close dialog, and display success
  function handleAdd() {
    validateDescription();
    if (validateTitle() || validateDescription()) {
      return;
    } else {
      setArrayEntry((arrayEntry) => [...arrayEntry, entry]);
      reset();
      closeDialog();
      addSuccess();
    }
  }

  //reset our entry state back to blanks
  const reset = () => {
    setEntry({
      title: '',
      description: '',
      deadline: '',
      priority: '',
    });
  };

  //toggles the checkbox so the update button can be hidden
  const toggleComplete = (index) => (e) => {
    let newArr = [...arrayEntry];
    let targetEntry = newArr[index];
    let completes = targetEntry.complete;
    newArr[index] = {
      title: targetEntry.title,
      description: targetEntry.description,
      deadline: targetEntry.deadline,
      priority: targetEntry.priority,
      complete: !completes,
    };
    setArrayEntry(newArr);
  };

  const openUpdateDialog = (index) => {
    setAddingState(false);
    setStoreIndex(index);
    openDialog();
    let targetEntry = arrayEntry[index];
    setEntry({
      title: targetEntry.title,
      description: targetEntry.description,
      deadline: targetEntry.deadline,
      priority: targetEntry.priority,
    });
  };

  const handleEdit = () => {
    if (validateDescription()) {
      return;
    } else {
      let indexToFind = storeIndex;
      console.log(indexToFind);
      let newArrs = [...arrayEntry];
      let targetEntry = newArrs[indexToFind];
      console.log(targetEntry);
      newArrs[indexToFind] = {
        title: targetEntry.title,
        description: entry.description,
        deadline: entry.deadline,
        priority: entry.priority,
        complete: targetEntry.complete,
      };
      setArrayEntry(newArrs);
      closeDialog();
      reset();
      updateSuccess();
    }
  };

  const deleteEntry = (index) => {
    let newArrs = [...arrayEntry];
    newArrs.splice(index, 1);
    setArrayEntry(newArrs);
    deleteSuccess();
  };

  return (
    <div>
      {/*HEADER*/}
      <CardHeader
        sx={{ bgcolor: 'primary.dark', color: 'white' }}
        title={
          <>
            <span>
              <MenuIcon className="svg_icons" id="header" />
              FRAMEWORKS
            </span>
          </>
        }
        style={{ textAlign: 'center' }}
        action={
          <>
            <Button
              variant="contained"
              onClick={openAddingDialog}
              sx={{ marginRight: '5%' }}
            >
              <AddCircleIcon />
              &nbsp;ADD
            </Button>
          </>
        }
      ></CardHeader>
      {/*DIALOG*/}
      <Dialog open={displayDialog} onClose={closeDialog}>
        {addingState ? (
          <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
            <AddCircleIcon id="header" />
            &nbsp; Add Task
          </DialogTitle>
        ) : (
          <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
            <EditIcon id="header" /> Edit Task
          </DialogTitle>
        )}
        <DialogContent>
          {/*Title*/}
          <br />
          {addingState && (
            <TextField
              error={titleError}
              id="titleInput"
              label="Title"
              helperText={titleValidator} //TODO - specified validation problem
              value={entry.title}
              sx={{ width: '100%' }}
              onChange={(e) => changeTitle(e)}
            />
          )}
          {/*Description*/}
          {addingState ? (
            <div>
              <br />
            </div>
          ) : (
            <br />
          )}
          <TextField
            error={descError}
            id="descriptionInput"
            label="Description"
            helperText={descriptionValidator}
            value={entry.description}
            sx={{ width: '100%' }}
            onChange={(e) => changeDescription(e)}
          />
          <br /> <br />
          {/*Date Picker */}
          <TextField
            type="date"
            id="dateInput"
            label="Deadline"
            fullWidth
            onChange={(e) => setEntry({ ...entry, deadline: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {/*RADIO */}
          <FormControl>
            <br />
            <FormLabel>Priority</FormLabel>
            <RadioGroup
              row
              onChange={(e) => setEntry({ ...entry, priority: e.target.value })}
            >
              <FormControlLabel value="low" control={<Radio />} label="Low" />
              <FormControlLabel value="med" control={<Radio />} label="Med" />
              <FormControlLabel value="high" control={<Radio />} label="High" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        {/*END OF DIALOG BUTTONS: ADD(OR EDIT) and CANCEL */}
        <DialogActions>
          {addingState ? (
            <Button
              onClick={() => handleAdd()}
              variant="contained"
              sx={{ bgcolor: 'primary.dark', width: '35%' }}
            >
              <AddCircleIcon fontSize="small" />
              &nbsp;Add
            </Button>
          ) : (
            <Button
              onClick={handleEdit}
              variant="contained"
              sx={{ bgcolor: 'primary.dark', width: '35%' }}
            >
              <EditIcon fontSize="small" />
              Edit
            </Button>
          )}
          <Button
            onClick={closeDialog}
            variant="contained"
            sx={{ bgcolor: 'red', width: '35%' }}
          >
            <DoNotDisturbAltIcon fontSize="small" />
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/*MAIN TABLE */}
      <CardContent sx={{ bgcolor: 'white' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ color: 'grey' }}>
                  Title
                </TableCell>
                <TableCell align="center" sx={{ color: 'grey' }}>
                  Description
                </TableCell>
                <TableCell align="center" sx={{ color: 'grey' }}>
                  Deadline
                </TableCell>
                <TableCell align="center" sx={{ color: 'grey' }}>
                  Priority
                </TableCell>
                <TableCell align="center" sx={{ color: 'grey' }}>
                  Is Complete
                </TableCell>
                <TableCell align="center" sx={{ color: 'grey' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {arrayEntry.map((entry, index) => (
                <TableRow key={entry.title}>
                  <TableCell align="center">{entry.title}</TableCell>
                  <TableCell align="center">{entry.description}</TableCell>
                  <TableCell align="center">
                    {moment(entry.deadline).format('MM/DD/YY')}
                  </TableCell>
                  <TableCell align="center">{entry.priority}</TableCell>
                  <TableCell align="center">
                    <Checkbox onChange={toggleComplete(index)} />
                  </TableCell>
                  <TableCell align="center">
                    <div>
                      {/*UPDATE(display if not checked) and DELETE BUTTONS*/}
                      {!entry.complete && (
                        <div>
                          <Button
                            variant="contained"
                            onClick={() => openUpdateDialog(index)}
                            sx={{ width: '85%' }}
                            id="update"
                          >
                            <EditIcon fontSize="small" />
                            &nbsp;Update
                          </Button>
                        </div>
                      )}
                      <div>
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() => deleteEntry(index)}
                          sx={{ bgcolor: 'red', width: '85%' }}
                        >
                          <CancelIcon fontSize="small" />
                          &nbsp;Delete
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      {/*TOASTER CONTAINER SO TOASTS CAN DISPLAY */}
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
