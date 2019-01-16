# Elastos.ORG.DID.Explorer.Web

## build & run

Install nvm nodejs 
```bash
>$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
```

Exit the terminal and open it again to activate NVM
```bash
>$ nvm install node
```

Install npm yarn
```bash
>$ sudo apt install npm

>$ npm install -g yarn
```

Install packages
```bash
>$ yarn install

>$ cd server

>$ yarn install

>$ cd ../
```

Run development

change server/db/config.json
```
{
	"user": "ROOT",
	"password": "PASSWORD",
	"database": "chain",
	"host": "127.0.0.1",
	"dialect": "mysql"
}
```

```bash
>$ yarn start
```

Run production 

change config/config.js
```
module.exports = {
  apiUrl:"THE HOST OF API:8080"
};
```

```bash
>$ yarn build

>$ yarn prod
```

