import React, {useCallback, useEffect, useMemo, useState} from "react"
import {Dialog, DialogTitle, DialogActions, TextField, DialogContent, FormControl, Button, InputAdornment, IconButton, Stack, Chip} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const defaultState = {
    latin: "",
    greek: "",
    suffix: "",
    translations: []
};

const EditTranslationModal = ({open, onClose, initialState = defaultState, onConfirm, title, onDelete, action = "Сохранить", isLoading = false}) => {
    const [translation, setTranslation] = useState("");
    const [form, setForm] = useState(initialState);

    const invalid = useMemo(() => !form.latin.trim() || form.translations.length < 1, [form]);

    const handleChangeForm = useCallback((e) => {
        const {value, id} = e.target;
        setForm({...form, [id]: value});
    }, [form]);

    const translationInvalid = useMemo(() => {
        const empty = translation.trim().length < 1;
        const duplicate = form.translations.includes(translation);
        return empty || duplicate;
    }, [translation, form]);

    const handleAddTranslation = useCallback(() => {
        if(!translationInvalid){
            setForm({...form, translations: [...form.translations, translation]});
            setTranslation("");
        }
    }, [translation, form, translationInvalid]);

    const handleTranslationDelete = useCallback((id) => {
        return () => {
            setForm({...form, translations: form.translations.filter((_, index) => index !== id)});
        }
    }, [form]);

    const handleClose = useCallback(() => {
        setForm(defaultState);
        onClose();
    }, []);

    const handleAdd = useCallback(() => {
        onConfirm(form);
        handleClose();
    }, [form]);

    const handlePressEnter = useCallback((e) => {
        if(e.code === "Enter"){
            handleAddTranslation();
        }
    }, [handleAddTranslation]);

    const deleteAction = useMemo(() => {
        if(!onDelete){
            return null;
        }
        const handleDelete = () => {
            onDelete();
            handleClose();
        };
        return (
            <Button disabled={isLoading} onClick={handleDelete} color="error">Удалить</Button>
        )
    }, [onDelete, isLoading])

    useEffect(() => {
        setForm(initialState);
    }, [initialState]);

    return(
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Stack spacing={1} justifyContent="space-between" direction="row" sx={{mt: 1}}>
                    <TextField
                        label="Латинский"
                        variant="outlined"
                        size="small"
                        onChange={handleChangeForm}
                        value={form.latin}
                        id="latin"
                        fullWidth
                    />
                    <TextField
                        label="Окончание"
                        variant="outlined"
                        size="small"
                        onChange={handleChangeForm}
                        value={form.suffix}
                        id="suffix"
                    />
                </Stack>
                <FormControl fullWidth sx={{mt: 1}}>
                    <TextField
                        label="Греческий"
                        variant="outlined"
                        size="small"
                        onChange={handleChangeForm}
                        value={form.greek}
                        id="greek"
                    />
                </FormControl>
                <FormControl fullWidth sx={{mt: 2}}>
                    <TextField
                        label="Перевод"
                        variant="outlined"
                        size="small"
                        value={translation}
                        onKeyPress={handlePressEnter}
                        onBlur={handleAddTranslation}
                        onChange={(e) => setTranslation(e.target.value)}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <IconButton
                                    onClick={handleAddTranslation}
                                    edge="end"
                                    disabled={translationInvalid || isLoading}
                                >
                                    <AddIcon />
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                </FormControl>
                <Stack sx={{mt: 2}} spacing={1} direction="row" useFlexGap flexWrap="wrap">
                    {
                        form.translations.map(
                            (item, index) => (
                                    <Chip
                                    key={index}
                                    label={item}
                                    onDelete={handleTranslationDelete(index)}
                                />
                            )
                        )
                    }
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button disabled={isLoading} onClick={handleClose} color="error">Отмена</Button>
                {deleteAction}
                <Button onClick={handleAdd} autoFocus color="success" disabled={invalid || isLoading}>
                    {action}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditTranslationModal