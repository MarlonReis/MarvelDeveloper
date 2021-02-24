# Abordagem arquitetural 
Foi utilizado a clean architecture para resolver os problema, essa arquitetura tem como objetivo abordar o problema a partir da ótica do negócio, tornado as tecnologias de persistencia e framework apenas plugins da nassa sistema, ou seja, projeto orientado a negócio e não á tecnologia.
Esse modelo também permite atingir os princípios SOLID com muito mais facilidade e também possui uma boa sinergia com TDD.


# Ambiente docker

Foi implementado dois ambientes, uma para teste e outro para ambiente local que também pode ser o de produção.

**Ambiente de teste**
Esse ambiente foi criado para executar os teste unitários, integração e e2e.

    sudo docker-compose -f docker-compose.yml --env-file test.env up -d database_test

**Ambiente local**
Executa a aplicação após o processo de build

    npm run build
Em seguida...

    sudo docker-compose -f docker-compose.yml --env-file local.env up -d database marvel_stone_api

# Testes

A aplicação foi desenvolvida utilizando o TDD como metodologia por esse motivo a cobertura de teste é bastante alta. Foi feita testes de unitários, integração, e2e e mutação.


**Testes unitários**
Utilizados para fazer teste de comportamentos da aplicação.

    npm run test:unit

**Teste de integração**
Utilizado para fazer testar o relacionamento entre nossa solução e sistema externos como banco de dados ou bibliotecas.

Antes de executar o comando, verifique se o ambiente de teste está executando(descrito no topico anterior)

    npm run test:integration

**Teste de cobertura**

Utilizada para identificar qual a porcentagem do nosso código de produção está testado.

    npm run test:ci

**Teste e2e**
Testa nosso aplicação de ponta-a-ponta.(Como possui poucos teste e2e eu coloquei dentro desse comando que irá executar todos os teste, unitários, integração e e2e)

    npm run test

**Teste de mutação**
*ATENTENÇÃO!!!*
Teste de mutação são teste que possui a responsabilidade de testar nossos testes e não de ser utilizado em processo de ci/cd.
Para saber mais, [Teste de Mutantes | Mauricio Aniche | Papo Reto](https://youtu.be/LfC4j7qq1Sg)

    npm run test:report


## Rotas

**CREATE USER ACCOUNT**

    POST: http://localhost:3000/api/account/create-users-accounts
    body:
    {
    	"name": "Marlon Reis",
    	"email": "marlon@reis.com.br",
    	"password": "Any@Password"
    }

**LOGIN**

    POST: http://localhost:3000/api/auth
    body:{
    	"email":"marlon@reis.com.br",
    	"password":"Any@Password"
    }

**UPDATE USER ACCOUNT DATA**

    PUT: http://localhost:3000/api/account
    header:{ "Authorization":"Bearer eyJhbGciOiJIUzI1NiI..."}
    body:{
    	"name":  "Marlon Reis",
    	"email":  "marlon@reis.com.br",
    	"password":  "123@Password",
    	"profileImage":  "https://aws.com/imagem.png"
    }

**CREATE CHARACTER**
 
    POST: http://localhost:3000/api/characters
    header:{ "Authorization":"Bearer eyJhbGciOiJIUzI1NiI..."}
    body:{
    	"name":  "Other Character",
    	"description":  "Any description",
    	"topImage":  "https://anyserver.com/top-image.png",
    	"profileImage":  "https://anyserver.com/profileImage.png",
    	"authorization":"authorization"
    }
    
**CREATE COMIC**

    POST: http://localhost:3000/api/comics
    header:{ "Authorization":"Bearer eyJhbGciOiJIUzI1NiI..."}
    body: {
	    "title":  "Any Title",
	    "published":  "2020-10-10",
	    "writer":  "Any Writer",
	    "penciler":  "Any Penciler",
	    "coverArtist":  "Any Cover Artist",
	    "description":  "Any Description",
	    "edition":  "5",
	    "coverImage":  "http://server.com/images.png",
		"characters":[
			{ 
			  "id":"1e185814-d934-4383-9e2c-a74e1976d820"
			}
		  ]   
    }
    
**FIND ALL CHARACTERS PAGEABLE**

    GET: http://localhost:3000/api/characters?perPage=1&page=1
    

**FIND ALL COMICS PAGEABLES**

    GET: http://localhost:3000/api/comics?perPage=0&page=1


**FAVORITE COMIC**

    POST: http://localhost:3000/api/account/comics
    header:{ "Authorization":"Bearer eyJhbGciOiJIUzI1NiI..."}
    body: {
		"comicId":"7bdbbc0e-c659-41b7-a709-0b855de0d8ca"
	}
    
**FIND MY FAVORITE COMIC**

    GET: http://localhost:3000/api/users/comics
    header:{ "Authorization":"Bearer eyJhbGciOiJIUzI1NiI..."}

**FIND COMIC BY ID**

    GET: http://localhost:3000/api/comics/c5c18b5f-5e7c-4416-9a36-485e29d0e160

**FIND CHARACTER BY ID**

    GET: http://localhost:3000/api/characters/f1dd1ba6-3ec9-4014-9ed4-900b4bd48285

**DISFAVOR COMIC**

    DELETE: http://localhost:3000/api/account/comics
    header:{ "Authorization":"Bearer eyJhbGciOiJIUzI1NiI..."}
    {
    		"comicId":"7bdbbc0e-c659-41b7-a709-0b855de0d8ca"
    }

