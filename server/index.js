const Koa = require('koa');
const serve = require('koa-static');
const app = new Koa();
const Router = require('@koa/router');
const router = new Router({prefix: "/api"});
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const {v4: uuidv4} =  require('uuid');

const PORT = process.env.port || 3000;

const getData = () => {
    const file = fs.readFileSync('./data.json', 'utf8');
    return JSON.parse(file);
}

const putData = (content) => {
    const data = typeof content !== "string" ? JSON.stringify(content) : content;
    fs.writeFileSync('./data.json', data);
}

router.get('/translations', (ctx) => {
    try{
        ctx.body = getData();
    } catch (e) {
        console.log(e);
        ctx.response.status = 500;
    }
});

router.post('/translations', (ctx) => {
    try{
        const body = ctx.request.body;
        const data = getData();
        const newData = [...data, {id: uuidv4(), ...body}];
        putData(newData);
        ctx.response.status = 200;
        ctx.body = newData;
    } catch (e) {
        console.log(e);
        ctx.status = 500;
    }
});

router.put('/translations', (ctx) => {
    try{
        const body = ctx.request.body;
        const {id} = body;
        console.log(body, id)
        const data = getData();
        const newData = data.map((item) => item.id === id ? body : item);
        console.log()
        putData(newData);
        ctx.response.status = 200;
        ctx.body = newData;
    } catch (e) {
        console.log(e);
        ctx.status = 500;
    }
});

router.delete('/translations/:id', (ctx) => {
    try{
        const {id} = ctx.params;
        const data = getData();
        const newData = data.filter((item) => item.id !== id);
        putData(newData);
        ctx.response.status = 200;
        ctx.body = newData;
    } catch (e) {
        console.log(e);
        ctx.status = 500;
    }
});

app.use((ctx, next) => {
    console.log(ctx.path, ctx.method);
    return next()
})
app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve('./public'));

app.listen(PORT);
console.log(`Server started on port ${PORT}`)
