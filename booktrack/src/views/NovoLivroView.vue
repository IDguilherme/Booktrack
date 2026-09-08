<script setup lang="ts">
import { useRouter } from 'vue-router'

import PageHeader from '../components/layout/PageHeader.vue'
import LivroForm from '../components/livros/LivroForm.vue'

const router = useRouter()
</script>

<template>

<div class="page">

    <button
        class="voltar"
        @click="router.push('/livros')"
    >
        ← Voltar
    </button>

    <PageHeader
        titulo="📖 Cadastrar Livro"
        descricao="Cadastre um novo livro para o acervo da biblioteca."
    />

    <div class="card">

        <LivroForm />

    </div>

</div>

</template>

<style scoped>

.page{

max-width:900px;

margin:auto;

}

.voltar{

margin-bottom:20px;

background:#6b7280;

}

.card{

background:white;

padding:30px;

border-radius:12px;

box-shadow:0 2px 10px rgba(0,0,0,.08);

}

</style>