import React, {useCallback, useState} from "react"
import {AppBar, Box, TextField, InputAdornment, Container, Button} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditTranslationModal from "../EditTranslationModal";
import useActive from "../../hooks/useActive";

const TopBar = ({filter, setFilter, loading, handleAdd}) => {
    const [modalOpen, showModal, hideModal] = useActive(false);

    return (
        <AppBar position="fixed">
            <Container maxWidth="lg">
                <Box sx={{padding: 2, display: "flex", justifyContent: "space-between"}} component="form">
                    <TextField
                        id="standard-basic"
                        label="Поиск"
                        variant="outlined"
                        size="small"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        disabled={loading}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        }}
                    />
                    <Button disabled={loading} variant="outlined" endIcon={<AddIcon />} color="success" onClick={showModal}>
                        Добавить
                    </Button>
                    <EditTranslationModal
                        onClose={hideModal}
                        open={modalOpen}
                        onConfirm={handleAdd}
                        isLoading={loading}
                        action="Добавить"
                        title="Добавить перевод"
                    />
                </Box>
            </Container>
        </AppBar>
    )
}

export default TopBar;