import React, {useCallback, useEffect, useMemo, useState} from "react"
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {
    Chip,
    Stack,
    Container,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import TopBar from "./components/TopBar";
import axios from "axios"
import useActive from "./hooks/useActive";
import EditTranslationModal from "./components/EditTranslationModal";
import capitalize from "lodash/capitalize"


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const App = () => {
    const [translations, setTranslations] = useState([]);
    const [filter, setFilter] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editModalOpen, openEditModal, closeEditModal] = useActive(false);
    const [showGreek, setShowGreek] = useState(true);

    const filteredTranslations = useMemo(() => {
        return translations.filter((item) => {
            const latin = item.latin.toLowerCase();
            const translations = item.translations.map((item) => item.toLowerCase());
            const lFilter = filter.toLowerCase();
            return latin.includes(lFilter) || translations.some((item) => item.includes(lFilter));
        }).sort((a, b) => (a.latin).localeCompare(b.latin));
    }, [filter, translations]);

    useEffect(() => {
        setIsLoading(true);
        axios.get("/api/translations").then((response) => {
            setTranslations(response.data);
            setIsLoading(false);
        })
    }, []);

    const handleEdit = useCallback((id) => {
        setEditId(id);
        openEditModal();
    }, []);

    const handleEditConfirm = useCallback((form) => {
        setIsLoading(true);
        axios.put(`/api/translations`, form).then((response) => {
            setTranslations(response.data);
            setIsLoading(false);
        })
    }, []);

    const handleDelete = useCallback((id) => {
        axios.delete(`/api/translations/${id}`).then((response) => {
            setTranslations(response.data);
            setIsLoading(false);
        })
    }, []);

    const handleAdd = useCallback((form) => {
        setIsLoading(true);
        axios.post("/api/translations", form).then((response) => {
            setTranslations(response.data);
            setIsLoading(false);
        });
    }, []);

    const editModal = useMemo(() => {
        const editItem = translations.find((item) => item.id === editId);
        if (!editItem) {
            return null;
        }
        const onDelete = () => handleDelete(editItem.id);
        return (
            <EditTranslationModal
                title={`Редактировать ${editItem.latin}`}
                onClose={closeEditModal}
                open={editModalOpen}
                onDelete={onDelete}
                onConfirm={handleEditConfirm}
                isLoading={isLoading}
                initialState={editItem}
            />
        )
    }, [editModalOpen, handleEditConfirm, isLoading, editId, translations]);

    return <ThemeProvider theme={darkTheme}>
        <TopBar filter={filter} setFilter={setFilter} handleAdd={handleAdd} isLoading={isLoading}/>
        <div style={{height: "100vh", padding: "100px 0 50px 0", display: "flex", flexDirection: "column"}}>
            <Container maxWidth="lg">
                <FormControlLabel
                    sx={{mb: 1, color: "#fff"}}
                    control={
                        <Checkbox
                            checked={showGreek}
                            onClick={() => setShowGreek(!showGreek)}
                        />
                    }
                    label="Показывать греческий"
                />

                <TableContainer component={Paper} sx={{height: "100%"}}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Латинский</TableCell>
                                {showGreek ? <TableCell align="left">Греческий</TableCell> : null}
                                <TableCell align="right">Перевод</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTranslations.map((row) => (
                                <TableRow
                                    hover
                                    key={row.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}, cursor: "pointer"}}
                                    onClick={() => handleEdit(row.id)}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.latin} <i>{row.suffix ? `(-${row.suffix})` : ""}</i>
                                    </TableCell>
                                    {showGreek ? <TableCell align="left">{row.greek || "-"}</TableCell> : null}
                                    <TableCell align="right">
                                        <Stack spacing={1} direction="row" useFlexGap flexWrap="wrap"
                                               justifyContent="flex-end">
                                            {
                                                row.translations.map(
                                                    (item, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={capitalize(item)}
                                                        />
                                                    )
                                                )
                                            }
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </div>
        {editModal}
    </ThemeProvider>
}

export default App;