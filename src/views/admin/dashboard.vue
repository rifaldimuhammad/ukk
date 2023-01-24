<script setup>
import Icons from '../../components/Icons.vue';
</script>
<template>
  <div class="statistics">
    <div class="statistics-wrapper">
      <div class="statistics-wrapper-item">
        <Icons name="profile-outline" />
        <div class="statistics-wrapper-item-info">
          <p>Followers</p>
          <p>112.000</p>
        </div>
      </div>
      <div class="statistics-wrapper-item">
        <Icons name="profile-outline" />
        <div class="statistics-wrapper-item-info">
          <p>Followers</p>
          <p>112.000</p>
        </div>
      </div>
      <div class="statistics-wrapper-item">
        <Icons name="profile-outline" />
        <div class="statistics-wrapper-item-info">
          <p>Followers</p>
          <p>112.000</p>
        </div>
      </div>
    </div>
  </div>
  <div class="card mb-4">
    <h5 class="card-header">Form Controls</h5>
    <div class="card-body">
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Email address</label>
        <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlReadOnlyInput1" class="form-label">Read only</label>
        <input class="form-control" type="text" id="exampleFormControlReadOnlyInput1" placeholder="Readonly input here..." readonly="" />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlReadOnlyInputPlain1" class="form-label">Read plain</label>
        <input type="text" readonly="" class="form-control-plaintext" id="exampleFormControlReadOnlyInputPlain1" value="email@example.com" />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlSelect1" class="form-label">Example select</label>
        <select class="form-select" id="exampleFormControlSelect1" aria-label="Default select example">
          <option selected="">Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="exampleDataList" class="form-label">Datalist example</label>
        <input class="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..." />
        <datalist id="datalistOptions">
          <option value="San Francisco"></option>
          <option value="New York"></option>
          <option value="Seattle"></option>
          <option value="Los Angeles"></option>
          <option value="Chicago"></option>
        </datalist>
      </div>
      <div class="mb-3">
        <label for="exampleFormControlSelect2" class="form-label">Example multiple select</label>
        <select multiple="" class="form-select" id="exampleFormControlSelect2" aria-label="Multiple select example">
          <option selected="">Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <div>
        <label for="exampleFormControlTextarea1" class="form-label">Example textarea</label>
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
      </div>
    </div>
  </div>
  
</template>
<style lang="scss">
.statistics {
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0 2rem rgba(grey, 0.3);
  &-wrapper {
    display: flex;
    align-items: center;
    gap: 2rem;
    &-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 2rem;
      background-color: var(--color-section);
      border-radius: 0.5rem;
      width: fit-content;
      & svg {
        height: 3rem;
      }
      &-info {
        p {
          font-size: 1.6rem;
          font-weight: 600;
          &:nth-child(1) {
            color: rgba(grey, 0.5);
          }
          &:nth-child(2) {
            color: var(--color-admin-blue);
          }
        }
      }
    }
  }
}
</style>
