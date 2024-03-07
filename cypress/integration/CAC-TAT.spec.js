/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function() {
    this.beforeEach(() => {
        cy.visit('src/index.html')
    })

    it('verifica o título da aplicação', function() {        
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        cy.get('input[name="firstName"]').type('Bruna')
        cy.get('input[name="lastName"]').type('Nunes')
        cy.get('input#email').type('bruna@gmail.com')
        cy.get('textarea[name="open-text-area"]').type(
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', 
            { delay: 10 }
        )

        cy.contains('button', 'Enviar').click()

        cy.get('span.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.get('input[name="firstName"]').type('Bruna')
        cy.get('input[name="lastName"]').type('Nunes')
        cy.get('input#email').type('bruna.com')
        cy.get('textarea[name="open-text-area"]').type('teste')

        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-númerico', function(){
        cy.get('#phone')
            .type('Bruna')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.get('input[name="firstName"]').type('Bruna')
        cy.get('input[name="lastName"]').type('Nunes')
        cy.get('input#email').type('bruna@teste.com')
        cy.get("#phone-checkbox").check() // marca o checkbox mas nao preenche o telefone
        cy.get('textarea[name="open-text-area"]').type('teste')

        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
        cy.get('input[name="firstName"]')
            .type('Bruna').should('have.value', 'Bruna')
            .clear().should('have.value', '')
        
        cy.get('input[name="lastName"]')
            .type('Nunes').should('have.value', 'Nunes')
            .clear().should('have.value', '')


        cy.get('input#email').type('bruna@teste.com')
            .should('have.value', 'bruna@teste.com')
            .clear().should('have.value', '')


        cy.get("#phone")
            .type("111111").should('have.value', '111111')
            .clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function() {
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('span.success').should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function() {
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function() {
        cy.get('#product').select(1).should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function() {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(($radio) => {
                cy.wrap($radio).check()
                .should('be.checked')
        })
    })

    it('marca ambos checkboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last().uncheck().should('not.to.be.checked')

    })

    it('seleciona um arquivo da pasta fixtures', function() {
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json')
            .should(($input) => {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function() {
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json', { action: 'drag-drop'})
            .should(($input) => {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture('example.json').as('sampleFile')

        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('@sampleFile')
            .should(($input) => {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })
    
    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
        
        cy.contains('Talking About Testing').should('be.visible')
    })
    
})
  