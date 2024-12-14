<template>
  <main>
    <h1>Page Not Found</h1>
    <p>The page that you requested could not be found.</p>
    <RouterLink to="/" class="button"> Return to the home page </RouterLink>
  </main>
</template>

<style scoped>
main {
  background-color: var(--royal); /* Set your desired background color */
  min-height: 100vh; /* Ensures it takes the full viewport height */
  padding: 20px; /* Adds some padding for spacing */
}
</style>
