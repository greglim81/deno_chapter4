import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { renderFileToString } from 'https://deno.land/x/dejs@0.8.0/mod.ts';

const app = new Application();
const router = new Router();

const todos: {id: String, name: String }[] = [
    {id: "1",name: "Learn Deno"},
    {id: "2",name: "Prepare lunch"},
    {id: "3",name: "Read bible"}
];

router.post('/add-todo',async (ctx,next) => {    
    const newTodoTitle =  (await ctx.request.body({type: "form"}).value).get('new-todo'); 
            
    if(newTodoTitle && newTodoTitle.trim().length !== 0){
        const newTodo = {
            id: new Date().toISOString(), 
            name: newTodoTitle! 
        }; 
        todos.push(newTodo); 
        console.log(newTodo);             
        ctx.response.redirect('/')
    }
    else{
        const body = await renderFileToString(Deno.cwd()+'/todos.ejs',{
            title: 'My Todos',
            todos: todos,
            error: "Field cannot be empty"
        });
        ctx.response.body = body;            
    }

});

    
router.get('/',async (ctx,next)=>{
    const body = await renderFileToString(Deno.cwd()+'/todos.ejs',{
        title: 'My Todos',
        todos: todos,
        error: null
    });
    ctx.response.body = body;    
});


app.use(async (ctx,next) =>{
    try{
      await next();
    }
    catch(err){
       console.log(err);
    }
});   

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
