import Fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();
const app= Fastify({logger:true});

app.get('/', async()=>{
    return {status: "NEXORA IS UP!"};
})

app.listen({port:3333},err=>{
    if(err){
        app.log.error(err);
        process.exit(1);
    }
});

