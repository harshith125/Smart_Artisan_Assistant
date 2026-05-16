function AccountantDashboard() {
  const user = JSON.parse(localStorage.getItem('user'))
  return (
    <div>
      <h2>Accountant Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <button onClick={() => { localStorage.clear(); window.location.href = '/login' }}>Logout</button>
    </div>
  )
}
export default AccountantDashboard
