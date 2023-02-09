<script setup></script>
<template></template>
<!-- global variable css -->
<style lang="scss">
.content {
  background-color: var(--color-grey-1);
}
.flex {
  display: flex;
  &-between {
    justify-content: space-between;
  }
  &-wrap {
    flex-wrap: wrap;
  }
}
.menu-value {
  padding: 1rem 2rem;
  border-radius: 10rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 4px 4px 2rem rgba(grey, 0.2);
  width: fit-content;
  background: white;
  span {
    display: flex;
    align-items: center;
    svg {
      height: 2rem;
    }
  }
  input {
    border: none;
    outline: none;
    width: 3rem;
    text-align: center;

    font-size: 2rem;
    font-weight: 500;
    color: var(--color-black);
  }
}
.alert {
  padding: 0.6rem 1.6rem;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  transition: all 0.5s;
  &-icon {
    display: flex;
    align-items: center;
    & svg {
      height: 2rem;
    }
  }
  &-desc {
    font-size: 1.6rem;
    font-weight: 500;
    flex: 1;
  }
  &-close {
    display: flex;
    align-items: center;
    & svg {
      height: 2rem;
    }
  }

  &-fixed {
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 200;
    width: 80%;
  }
  &-yellow {
    color: rgb(224, 158, 0);
    background-color: #fff3cd;
    & svg {
      fill: rgb(224, 158, 0);
    }
  }
  &-red {
    color: red;
    background-color: #f8d7da;
    & svg {
      fill: red;
    }
  }
  &-green {
    color: #146c43;
    background-color: #d1e7dd;
    & svg {
      fill: #146c43;
    }
  }
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  & a {
    font-size: 1.6rem;
    text-transform: capitalize;
    color: var(--color-black);
  }
  & span {
    font-size: 1.6rem;
    text-transform: capitalize;
    color: var(--color-black);
  }
  & p {
    font-size: 1.6rem;
    text-transform: capitalize;
    color: var(--color-black);
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.table-responsive {
  min-height: 300px;
}
</style>
