<template>
  <div class="h-full flex justify-center items-center">
    <div class="flex flex-col items-center w-68">
      <img src="../assets/logo.png" alt="Logo" class="w-60" />
      <h1 class="text-2xl text-codeway-blue-50 mt-10 mb-3">Please sign in</h1>
      <form class="flex flex-col w-full">
        <input
          type="email"
          placeholder="E-mail address"
          class="w-full border border-codeway-border focus:border-codeway-border-focus focus:outline-none p-2 rounded-t-md placeholder:text-codeway-text-placeholder text-codeway-text"
        />
        <input
          type="password"
          placeholder="Password"
          class="w-full border border-codeway-border focus:border-codeway-border-focus focus:outline-none focus:ring-0 p-2 rounded-b-md placeholder:text-codeway-text-placeholder text-codeway-text"
        />
        <button
          type="submit"
          class="bg-gradient-to-r from-codeway-button-start to-codeway-button-end text-white p-2 rounded-md mt-2"
        >
          Sign in
        </button>
      </form>
      <p class="text-codeway-text-placeholder text-sm mt-16">Codeway © 2021</p>
    </div>
  </div>
</template>
